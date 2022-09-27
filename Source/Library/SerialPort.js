
import ControlCharacter from './ControlCharacter.js'
import FileCommand from './FileCommand.js'
import ControlFlag from './ControlFlag.js'
import FileStatus from './FileStatus.js'
import InputFlag from './InputFlag.js'
import ModemLine from './ModemLine.js'
import Settings from './Settings.js'

import {
    flushIO , modifyFile , deviceCall
} from './Native.js'


const { errors } = Deno;
const { BadResource } = errors;
const { log } = console;



export default class SerialPort {

    #pointer;

    constructor ( pointer ){
        this.#pointer = pointer;
        log('Constructor',this.#pointer,pointer);
    }



    close (){

        for(const method of [ 'open' , 'close' ])
            invalidateFunction(this,method);

        for(const method of [ 'baudRate' , 'charSize' , 'flowControl' ])
            invalidateAccessor(this,method);
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

        const { inputSpeed , outputSpeed } = await this.settings();

        if(inputSpeed !== outputSpeed)
            throw 'Mismatched input & output speed.';

        return inputSpeed;
    }

    async setBaudRate ( rate ){

        log('SetBaud',this.#pointer);

        await this.settings(async (settings) => {
            settings.speed = rate;
        })

    }

    async charSize (){

        const { controlFlags } = await this.settings();

        return (controlFlags & ControlFlag.Size);
    }

    async setCharSize ( size ){

        await this.settings(async (settings) => {

            let { inputFlags , outputFlags } = settings;

            outputFlags &= ~ ControlFlag.Size;
            outputFlags |= size;

             if(size === 48)
                 inputFlags &= ~ InputFlag.Strip;
             else
                 inputFlags |= InputFlag.Strip;

             settings.outputFlags = outputFlags;
             settings.inputFlags = inputFlags;
        })
    }

    async flowControl (){

        const { inputFlags , controlFlags } = await this.settings();

        const
            togglableOutput = (inputFlags & InputFlag.ToggelableOutput) ,
            togglableInput = (inputFlags & InputFlag.ToggelableInput) ;

        if(
            togglableOutput && togglableInput &&
            (settings.controlChar(ControlCharacter.Start) === 0x11) &&
            (settings.controlChar(ControlCharacter.Stop)  === 0x13)
        ) return 'software';

        if( ! togglableOutput && ! togglableInput )
            return (controlFlags & 20000000000)
                ? 'hardware'
                : null ;

        throw 'Unknown control flow type.'
    }

    async setFlowControl ( flow ){

        if(![ null , 'software' , 'hardware' ].includes(flow))
            throw 'Only null , software & hardware parity can be used.';

        await flushIO(this.#pointer);

        await this.settings(async (settings) => {

            let { inputFlags , controlFlags } = settings;

            switch(flow){
            case 'hardware' :

                inputFlags &= ~ ( InputFlag.TogglableInput | InputFlag.ToggelableOutput );
                controlFlags |= 20000000000;
                settings.controlChar(ControlCharacter.Start,0x0);
                settings.controlChar(ControlCharacter.Stop,0x0);

                break;
            case 'software' :

                inputFlags |= InputFlag.TogglableInput | InputFlag.ToggelableOutput;
                controlFlags &= ~ 20000000000;
                settings.controlChar(ControlCharacter.Start,0x11);
                settings.controlChar(ControlCharacter.Stop,0x13);

                break;
            default:
                inputFlags &= ~ ( InputFlag.TogglableInput | InputFlag.ToggelableOutput );
                controlFlags &= ~ 20000000000;
            }

            settings.controlFlags = controlFlags;
            settings.inputFlags = inputFlags;
        })
    }

    async parity (){

        const settings = await Settings.of(this.#pointer);
        const { controlFlags } = settings;

        const
            enabled = controlFlags & ControlFlag.ParityEnabled ,
            odd = controlFlags & ControlFlag.OddParity ;

        if(enabled)
            return (odd)
                ? 'odd' : 'even' ;

        return null;
    }

    async setParity ( parity ){

        if(![ null , 'odd' , 'even' ].includes(parity))
            throw 'Only null , odd & even parity can be used.';

        const settings = await Settings.of(this.#pointer);
        let { controlFlags , inputFlags } = settings;


        let
            enabled = [ 'odd' , 'even' ].includes(parity) ,
            odd = parity === 'odd' ;

        controlFlags &= ~ ( ControlFlag.ParityEnabled | ControlFlag.OddParity );

        if(enabled)
            controlFlags |= ControlFlag.ParityEnabled;

        if(odd)
            controlFlags |= ControlFlag.OddParity;

        settings.controlFlags = controlFlags;


        inputFlags |= (enabled)
            ? InputFlag.CheckParity
            : InputFlag.IgnoreErrors ;

        settings.inputFlags = inputFlags;

        await settings.writeTo(this.#pointer);
    }

    async stopBits (){

        const settings = await Settings.of(this.#pointer);
        const { controlFlags } = settings;

        return (controlFlags & ControlFlag.StopBit)
            ? 2 : 1 ;
    }

    async setStopBits ( bits ){

        if(![ 1 , 2 ].includes(bits))
            throw 'Only 1 or 2 stop bits can be used.';

        const settings = await this.settings();
        let { controlFlags } = settings;

        if(bits === 1)
            controlFlags &= ~ ControlFlag.StopBit;
        else
            controlFlags |=   ControlFlag.StopBit;

        settings.controlFlags = controlFlags;
        await settings.writeTo(this.#pointer);
    }

    async vMin (){
        return await Settings
            .of(this.#pointer)
            .vmin;
    }

    async setVMin ( minimum ){

        if(!inRange(minimum,0,255))
            throw 'VMin must be in the range of 0 - 255.'

        const settings = await Settings.of(this.#pointer);
        settings.vmin = minimum;
        await settings.writeTo(this.#pointer);
    }

    async vTime (){
        return await Settings
            .of(this.#pointer)
            .vtime;
    }

    async setVTime ( time ){

        if(!inRange(time,0,255))
            throw 'VTime must be in the range of 0 - 255.'

        const settings = await Settings.of(this.#pointer);
        settings.vtime = time;
        await settings.writeTo(this.#pointer);
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
