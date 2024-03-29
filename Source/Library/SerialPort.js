
import { FileCommand , FileStatus , ModemLine } from './Types/mod.ts'
import { sleep } from './Native.ts'

import Settings from './Settings.js'

import {
    flushIO , flushInput as flushI , modifyFile , deviceCall ,
    closeFile , availableBytes , readBytes as readBs
} from './Native.ts'


const { debug , log } = console;

export default class SerialPort {

    #transmissionDelay = 0;
    #pointer;
    #backup;

    constructor ( pointer , _backup ){
        this.#pointer = pointer;
        debug('Constructor',this.#pointer,pointer);
    }



    async close (){

        try {

            await this.#backup?.writeTo(this.#pointer);

        } catch ( error ){
            console.error('Failed to restore port settings',error);
        } finally {
            closeFile(this.#pointer);
        }
        //
        // for(const method of [ 'open' , 'close' ])
        //     invalidateFunction(this,method);
        //
        // for(const method of [ 'baudRate' , 'charSize' , 'flowControl' ])
        //     invalidateAccessor(this,method);
    }


    async isDataAvailable (){
        const count = await availableBytes(this.#pointer);
        return count > 0;
    }

    async available (){
        return await availableBytes(this.#pointer)
    }

    async flushInput (){
        await flushI(this.#pointer);
    }

    async settings ( modifyFunction ){

        const settings = await Settings.of(this.#pointer);

        if(modifyFunction){
            await modifyFunction(settings);
            await settings.writeTo(this.#pointer);
        } else {
            return settings;
        }
    }


    async baudRate (){

        const settings = await this.settings();
        const { input , output } = settings.speed;

        if(input !== output)
            throw 'Mismatched input & output speed.';

        return input;
    }

    async setBaudRate ( rate ){

        await this.settings(( settings ) => {
            settings.speed.input = settings.speed.output = rate;
        })

        this.#transmissionDelay = (8 * 10e6) / rate;
    }

    async charSize (){
        return await this.settings().characterSize;
    }

    async setCharSize ( size ){

        if(size < 5 || size > 8)
            throw 'Character Size has to be in the range of 5 - 8 bits';

        await this.settings(( settings ) => {
            settings.all.characterSize = size;
            settings.flags.input.StripLastBit = ( size < 8 );
        })
    }

    async flowControl (){

        const settings = await this.settings();
        const { control , input } = settings.flags;

        if(
            input.InputFlowControl &&
            input.OutputFlowControl &&
            settings.controlCharacters.Start === 0x11 &&
            settings.controlCharacters.Stop === 0x13
        ) return 'software';

        if(
            ! input.InputFlowControl &&
            ! input.OutputFlowControl
        ) return (control.HardwareFlow)
            ? 'hardware' : null ;

        throw 'Unknown control flow type.'
    }

    async setFlowControl ( flow ){

        if(![ null , 'software' , 'hardware' ].includes(flow))
            throw 'Only null , software & hardware parity can be used.';

        await flushIO(this.#pointer);

        await this.settings(( settings ) => {

            const { input , control } = settings.flags;

            switch(flow){
            case 'hardware' :

                input.OutputFlowControl = false;
                input.InputFlowControl = false;

                control.HardwareFlow = true;
                settings.controlCharacters.Start = 0x0;
                settings.controlCharacters.Stop = 0x0;

                break;
            case 'software' :

                input.OutputFlowControl = true;
                input.InputFlowControl = true;

                control.HardwareFlow = false;
                settings.controlCharacters.Start = 0x11;
                settings.controlCharacters.Stop = 0x13;

                break;
            default:

                input.OutputFlowControl = false;
                input.InputFlowControl = false;

                control.HardwareFlow = false;
            }
        })
    }

    async parity (){

        const settings = await this.settings();
        const { control } = settings.flags;

        if(control.ParityEnabled)
            return (control.OddParity)
                ? 'odd' : 'even' ;

        return null;
    }

    async setParity ( parity ){

        if(![ null , 'odd' , 'even' ].includes(parity))
            throw 'Only null , odd & even parity can be used.';

        const settings = await this.settings();
        const { control , input } = settings.flags;

        const
            enabled = [ 'odd' , 'even' ].includes(parity) ,
            odd = parity === 'odd' ;

        control.ParityEnabled = enabled;
        control.OddParity = odd;

        if(enabled)
            input.CheckParity = true;
        else
            input.IgnoreErrors = true;

        await settings.writeTo(this.#pointer);
    }

    async stopBits (){
        return (await this.settings()).flags.control.DoubleStopBits ? 2 : 1 ;
    }

    async useDoubleStopBits ( state ){

        await this.settings((settings) => {
            settings.flags.control.DoubleStopBits = state;
        })
    }

    async vMin (){
        return (await this.settings()).controlCharacters.Min;
    }

    async setVMin ( char ){

        if(!inRange(char,0,255))
            throw 'VMin must be in the range of 0 - 255.'

        await this.settings((settings) => {
            settings.controlCharacters.Min = char;
        })
    }

    async vTime (){
        return (await this.settings()).controlCharacters.Time;
    }

    async setVTime ( char ){

        if(!inRange(char,0,255))
            throw 'VTime must be in the range of 0 - 255.'

        await this.settings((settings) => {
            settings.controlCharacters.Time = char;
        })
    }

    async dtr (){
        return await this.#queryModemControlLine(ModemLine.DataTerminalReady);
    }

    async setDTR ( state ){
        await this.#updateModemControlLine(ModemLine.DataTerminalReady,state);
    }

    async rts (){
        return await this.#queryModemControlLine(ModemLine.RequestToSend);
    }

    async setRTS ( state ){
        await this.#updateModemControlLine(ModemLine.RequestToSend,state);
    }


    async cts (){
        return await this.#queryModemControlLine(ModemLine.ClearToSend);
    }

    async dsr (){
        return await this.#queryModemControlLine(ModemLine.DataSetReady);
    }


    async #queryModemControlLine ( flag ){

        const flags = 0;

        await deviceCall(this.#pointer,Command.QueryModemBits,flags);

        return (flags & flag);
    }

    async #updateModemControlLine ( flag , state ){

        const command = (state)
            ? Commands.SetModemBit
            : Commands.ClearModemBit ;

        await deviceCall(this.#pointer,command,flag)
    }


    async updateSerialPortBlockingStatus ( state ){

        let flags = await this.#queryFileStatus();

        flags = (state)
            ? flags & ~ FileStatus.NonBlocking
            : flags |   FileStatus.NonBlocking ;

        await modifyFile(this.#pointer,FileCommand.UpdateStatus,flags);
    }

    async querySerialPortBlockingStatus (){

        const flags = await this.#queryFileStatus();

        return ( flags & FileStatus.NonBlocking )
    }

    async #queryFileStatus(){
        return await modifyFile(this.#pointer,FileCommand.QueryStatus,0);
    }

    async readBytes ( byteCount = 0 , timeout = 1000 ){

        // const bytes = new Uint8Array(byteCount);
        let bytes = new Uint8Array(0);

        // let pointer;

        let remaining = byteCount;


        const start = Date.now();

        while ( remaining > 0 ){

            // pointer = Deno.UnsafePointer
                // .of(bytes,byteCount - remaining)


            const temp = new Uint8Array(remaining)

            const readCount = await readBs(this.#pointer,temp,remaining);

            debug('Read Count',readCount)
            // debug('Pointer',pointer)
            debug('Bytes',temp)

            bytes = new Uint8Array([ ... bytes , ... temp.slice(0,readCount) ])

            remaining -= readCount;


            const delta = Date.now() - start;

            if(delta > timeout){
                reject(new Deno.errors.TimedOut(`Data didn't arrive in time.`));
                return;
            }

            await sleep(this.#transmissionDelay)
        }

        return bytes
    }


    async printSettings (){

        const settings = await this.settings();

        log(settings.all);
    }
}


function inRange(value,min,max){
    return value >= min && value <= max;
}
