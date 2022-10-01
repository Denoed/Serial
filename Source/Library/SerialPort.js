
import ControlCharacter from './Enums/ControlCharacter.js'
import FileCommand from './Enums/FileCommand.js'
import ControlFlag from './Enums/ControlFlag.js'
import FileStatus from './Enums/FileStatus.js'
import { InputFlag } from './Enums/InputFlag.ts'
import ModemLine from './Enums/ModemLine.js'
import Settings from './Settings.js'

import { BaudRate } from './Helper/BaudRate.ts'

import { sleep } from './Native.js'

import {
    flushIO , flushInput as flushI , modifyFile , deviceCall ,
     closeFile , availableBytes , readByte as readB , readBytes as readBs
} from './Native.js'


const { errors } = Deno;
const { BadResource } = errors;
const { log } = console;

//
//
// const baudRateType = {
//     4000000 : 4111 ,
//     3500000 : 4110 ,
//     3000000 : 4109 ,
//     2500000 : 4108 ,
//     2000000 : 4107 ,
//     1500000 : 4106 ,
//     1152000 : 4105 ,
//     1000000 : 4104 ,
//     921600 : 4103 ,
//     576000 : 4102 ,
//     500000 : 4101 ,
//     460800 : 4100 ,
//     230400 : 4099 ,
//     115200 : 4098 ,
//     57600 : 4097 ,
//     38400 : 15 ,
//     19200 : 14 ,
//     9600 : 13 ,
//     4800 : 12 ,
//     2400 : 11 ,
//     1800 : 10 ,
//     1200 : 9 ,
//     600 : 8 ,
//     300 : 7 ,
//     200 : 6,
//     150 : 5,
//     134 : 4,
//     110 : 3,
//     75 : 2,
//     50 : 1
// }


// const bitRateTypes = Object.fromEntries([...Object.entries(baudRateType)].map(([ a, b]) => [ b  , a ]));

export default class SerialPort {

    #transmissionDelay = 0;
    #pointer;
    #backup;

    constructor ( pointer , backup ){
        this.#pointer = pointer;
        log('Constructor',this.#pointer,pointer);
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
        // log('Count',count);
        return count > 0;
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

        // log('SetBaud',this.#pointer,rate,baudRateType[rate]);

        await this.settings(async (settings) => {
            settings.speed.input = settings.speed.output = rate;//baudRateType[rate];
        })

        this.#transmissionDelay = (8 * 10e6) / rate;
    }

    async charSize (){
        return await this.settings().characterSize;

        // const { control } = await this.settings().flags;
        //
        // return (controlFlags & ControlFlag.CharacterSize);
    }

    async setCharSize ( size ){

        if(size < 5 || size > 8)
            throw 'Character Size has to be in the range of 5 - 8 bits';

        // size -= 5;
        // size <<= 5;

        await this.settings(async (settings) => {

            settings.all.characterSize = size;

            settings.flags.input.StripLastBit = ( size < 8 );

            // let { inputFlags , controlFlags } = settings;
            //
            // controlFlags &= ~ ControlFlag.CharacterSize;
            // controlFlags |= size;
            //
            //  if(size === ControlCharacter.CharacterSize)
            //      inputFlags &= ~ InputFlag.Strip;
            //  else
            //      inputFlags |= InputFlag.Strip;
            //
            //  settings.controlFlags = controlFlags;
            //  settings.inputFlags = inputFlags;
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

        //
        //
        // const { inputFlags , controlFlags } = await this.settings();
        //
        // const
        //     togglableOutput = (inputFlags & InputFlag.OutputFlowControl) ,
        //     togglableInput = (inputFlags & InputFlag.InputFlowControl) ;
        //
        // if(
        //     togglableOutput && togglableInput &&
        //     (settings.controlChar(ControlCharacter.Start) === 0x11) &&
        //     (settings.controlChar(ControlCharacter.Stop)  === 0x13)
        // ) return 'software';
        //
        // if( ! togglableOutput && ! togglableInput )
        //     return (controlFlags & 20000000000)
        //         ? 'hardware'
        //         : null ;

        throw 'Unknown control flow type.'
    }

    async setFlowControl ( flow ){

        if(![ null , 'software' , 'hardware' ].includes(flow))
            throw 'Only null , software & hardware parity can be used.';

        await flushIO(this.#pointer);

        await this.settings(async (settings) => {

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

            //
            //
            // let { inputFlags , controlFlags } = settings;
            //
            // switch(flow){
            // case 'hardware' :
            //
            //     inputFlags &= ~ ( InputFlag.InputFlowControl | InputFlag.OutputFlowControl );
            //     controlFlags |= 20000000000;
            //     settings.controlChar(ControlCharacter.Start,0x0);
            //     settings.controlChar(ControlCharacter.Stop,0x0);
            //
            //     break;
            // case 'software' :
            //
            //     inputFlags |= InputFlag.InputFlowControl | InputFlag.OutputFlowControl;
            //     controlFlags &= ~ 20000000000;
            //     settings.controlChar(ControlCharacter.Start,0x11);
            //     settings.controlChar(ControlCharacter.Stop,0x13);
            //
            //     break;
            // default:
            //     inputFlags &= ~ ( InputFlag.InputFlowControl | InputFlag.OutputFlowControl );
            //     controlFlags &= ~ 20000000000;
            // }
            //
            // settings.controlFlags = controlFlags;
            // settings.inputFlags = inputFlags;
        })
    }

    async parity (){

        const settings = await this.settings();
        const { control } = settings.flags;

        if(control.ParityEnabled)
            return (control.OddParity)
                ? 'odd' : 'even' ;

        return null;
        //
        //
        // const settings = await Settings.of(this.#pointer);
        // const { controlFlags } = settings;
        //
        // const
        //     enabled = controlFlags & ControlFlag.ParityEnabled ,
        //     odd = controlFlags & ControlFlag.OddParity ;
        //
        // if(enabled)
        //     return (odd)
        //         ? 'odd' : 'even' ;
        //
        // return null;
    }

    async setParity ( parity ){

        if(![ null , 'odd' , 'even' ].includes(parity))
            throw 'Only null , odd & even parity can be used.';

        const settings = await this.settings();
        const { control , input } = settings.flags;

        // const settings = await Settings.of(this.#pointer);
        // let { controlFlags , inputFlags } = settings;


        let
            enabled = [ 'odd' , 'even' ].includes(parity) ,
            odd = parity === 'odd' ;

        control.ParityEnabled = enabled;
        control.OddParity = odd;
        //
        // controlFlags &= ~ ( ControlFlag.ParityEnabled | ControlFlag.OddParity );
        //
        // if(enabled)
        //     controlFlags |= ControlFlag.ParityEnabled;
        //
        // if(odd)
        //     controlFlags |= ControlFlag.OddParity;
        //
        // settings.controlFlags = controlFlags;


        if(enabled)
            input.CheckParity = true;
        else
            input.IgnoreErrors = true;
        //
        // inputFlags |= (enabled)
        //     ? InputFlag.CheckParity
        //     : InputFlag.IgnoreErrors ;

        // settings.inputFlags = inputFlags;

        await settings.writeTo(this.#pointer);
    }

    async stopBits (){
        return (await this.settings()).flags.control.DoubleStopBits ? 2 : 1 ;
        //
        // const settings = await Settings.of(this.#pointer);
        // const { controlFlags } = settings;
        //
        // return (controlFlags & ControlFlag.DoubleStopBits)
        //     ? 2 : 1 ;
    }

    async useDoubleStopBits ( state ){

        await this.settings((settings) => {
            settings.flags.control.DoubleStopBits = state;
        })
        //
        // const settings = await this.settings();
        // let { controlFlags } = settings;
        //
        // if(state)
        //     controlFlags |=   ControlFlag.DoubleStopBits;
        // else
        //     controlFlags &= ~ ControlFlag.DoubleStopBits;
        //
        // settings.controlFlags = controlFlags;
        // await settings.writeTo(this.#pointer);
    }

    async vMin (){
        return (await this.settings()).controlCharacters.Min;
        // return await Settings
        //     .of(this.#pointer)
        //     .vmin;
    }

    async setVMin ( char ){

        if(!inRange(char,0,255))
            throw 'VMin must be in the range of 0 - 255.'

        await this.settings((settings) => {
            settings.controlCharacters.Min = char;
        })
        //
        // const settings = await Settings.of(this.#pointer);
        // settings.vmin = minimum;
        // await settings.writeTo(this.#pointer);
    }

    async vTime (){
        return (await this.settings()).controlCharacters.Time;
        // return await Settings
        //     .of(this.#pointer)
        //     .vtime;
    }

    async setVTime ( char ){

        if(!inRange(char,0,255))
            throw 'VTime must be in the range of 0 - 255.'

        await this.settings((settings) => {
            settings.controlCharacters.Time = char;
        })
        //
        // const settings = await Settings.of(this.#pointer);
        // settings.vtime = time;
        // await settings.writeTo(this.#pointer);
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
        this.#updateModemControlLine(ModemLine.RequestToSend,state);
    }


    async cts (){
        return await this.#queryModemControlLine(ModemLine.ClearToSend);
    }

    async dsr (){
        return await this.#queryModemControlLine(ModemLine.DataSetReady);
    }


    async #queryModemControlLine ( flag ){

        let flags = 0;

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

        let flags = await this.#queryFileStatus();

        return (flags & FileStatus.NonBlocking);
    }

    async #queryFileStatus(){
        return await modifyFile(this.#pointer,FileCommand.QueryStatus,0);
    }

    async readBytes ( byteCount = 0 , timeout = 1000 ){


        const bytes = new Uint8Array(byteCount);

        let pointer = Deno.UnsafePointer.of(bytes);

        let remaining = byteCount;


        const start = Date.now();

        while(remaining > 0){

            const readCount = await readBs(this.#pointer,pointer,remaining);

            remaining -= readCount;
            pointer += readCount;


            const delta = Date.now() - start;

            if(delta > timeout){
                reject(new Deno.errors.TimedOut('Data didn\'t arrive in time.'));
                return;
            }

            await sleep(this.#transmissionDelay);
        }

        return bytes;
    }


    async printSettings (){

        const settings = await this.settings();

        log(settings.all);

        // log(`
        //     Control Flags
        //     =============
        //
        //     Character Size   : ${ settings.characterSize }
        //     Double Stop Bits : ${ settings.doubleStopBits }
        //     Read             : ${ settings.canRead }
        //     Parity           : ${ settings.usesParity }
        //     Odd Parity       : ${ settings.oddParity }
        //     Hangs Up         : ${ settings.hangsUp }
        //     Local            : ${ settings.isLocal }
        //
        //     Input Flags
        //     ===========
        //
        //     Ignore Breaks              : ${ settings.input_IgnoreBreaks }
        //     Interrupt On Break         : ${ settings.input_InterruptOnBreak }
        //     Ignore Errors              : ${ settings.input_IgnoreErrors }
        //     Mark Errors                : ${ settings.input_MarkErrors }
        //     Check Parity               : ${ settings.input_CheckParity }
        //     Strip Last Bit             : ${ settings.input_StripLastBit }
        //     Newline to Carriege Return : ${ settings.input_NewlineToCarriegeReturn }
        //     Ignore Carriege Return     : ${ settings.input_IgnoreCarriegeReturn }
        //     Carriege Return To Newline : ${ settings.input_CarriegeReturnToNewline }
        //     UpperCase To LowerCase     : ${ settings.input_UpperCaseToLowerCase }
        //     Output Flow Control        : ${ settings.input_OutputFlowControl }
        //     Any Char Restarts          : ${ settings.input_AnyCharRestarts }
        //     Input Flow Control         : ${ settings.input_InputFlowControl }
        //     Bell On Full Queue         : ${ settings.input_BellOnFullQueue }
        //     UTF8                       : ${ settings.input_UTF8 }
        //
        //     Flags
        //     =====
        //     Output: ${ settings.outputFlags }
        //     Local: ${ settings.localFlags }
        //
        //     Speed
        //     =====
        //     Output : ${ bitRateTypes[settings.outputSpeed] }
        //     Input : ${ bitRateTypes[settings.inputSpeed] }
        //
        //     line : ${ settings.line }
        //
        //     VTime : ${ settings.vtime }
        //     VMin : ${ settings.vmin }
        // `)
    }
}



function invalidateFunction ( object , method ){
    object[method] = warnClosed();
}

function invalidateAccessor ( object , method ){
    Object.defineProperty(object,method,{
        get : warnClosed ,
        set : warnClosed
    });
}

function warnClosed (){
    throw new BadResource('The serial port is closed.');
}


function inRange(value,min,max){
    return value >= min && value <= max;
}
