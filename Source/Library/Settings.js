
import Definitions from './Definitions.js'
import * as Paths from './Paths.js'


const { dlopen , errors } = Deno;
const { log } = console;

const { symbols : Native } =
    dlopen(Paths.sharedLibrary,Definitions);


import ControlFlag from './Enums/ControlFlag.js'
import InputFlag from './Enums/InputFlag.js'
import { exportTermios } from './Native.js'


import { updateTerminalSettings , queryTerminalSettings } from './Native.js'



function u32 ( bytes ){
    return bytes[0] <<  0
         | bytes[1] <<  8
         | bytes[2] << 16
         | bytes[3] << 24 ;
}


export default class Settings {

    #settings;
    #pointer;

    static async of ( file ){
        const [ settings , pointer ] = await queryTerminalSettings(file);

        const bytes = exportTermios(pointer);

        log('Settings btes',bytes);

        log('New',u32(bytes.subarray(8,12)));


        const s =  new Settings(settings,pointer);

        log('Old',s.controlFlags);

        return s;
    }

    constructor ( settings , pointer ){
        this.#settings = settings;
        this.#pointer = pointer;
    }


    log (){
        log('Settings',this.#pointer);
    }

    get pointer (){
        return this.#pointer;
    }

    async writeTo ( file ){
        await updateTerminalSettings(file,this.#pointer);
    }



    set speed ( speed ){
        Native.Termios_setSpeed(this.#pointer,speed);
    }

    get outputSpeed (){
        return Native.Termios_getOutputSpeed(this.#pointer);
    }

    get inputSpeed (){
        return Native.Termios_getInputSpeed(this.#pointer);
    }



    controlChar (type){
        return Native.Termios_getControlChar(this.#pointer,type);
    }


    #hasControlFlag ( flag ){
        return (this.controlFlags & flag) > 0
    }

    #hasInputFlag ( flag ){
        return (this.inputFlags & flag) > 0
    }


    /**
     *  Control Flags
     */

    get characterSize (){

        let { controlFlags } = this;
        controlFlags &= ControlFlag.CharacterSize;
        controlFlags >>= 5;
        controlFlags += 5;
        return controlFlags;
    }

    get doubleStopBits (){
        return this.#hasControlFlag(ControlFlag.DoubleStopBits);
    }

    get canRead (){
        return this.#hasControlFlag(ControlFlag.Read);
    }

    get usesParity (){
        return this.#hasControlFlag(ControlFlag.ParityEnabled);
    }

    get oddParity (){
        return this.#hasControlFlag(ControlFlag.OddParity);
    }

    get hangsUp (){
        return this.#hasControlFlag(ControlFlag.HangUp);
    }

    get isLocal (){
        return this.#hasControlFlag(ControlFlag.Local);
    }


    /**
     *  Input Flags
     */

    get input_IgnoreBreaks (){
        return this.#hasInputFlag(InputFlag.IgnoreBreaks);
    }

    get input_InterruptOnBreak (){
        return this.#hasInputFlag(InputFlag.InterruptOnBreak);
    }

    get input_IgnoreErrors (){
        return this.#hasInputFlag(InputFlag.IgnoreErrors);
    }

    get input_MarkErrors (){
        return this.#hasInputFlag(InputFlag.MarkErrors);
    }

    get input_CheckParity (){
        return this.#hasInputFlag(InputFlag.CheckParity);
    }

    get input_StripLastBit (){
        return this.#hasInputFlag(InputFlag.StripLastBit);
    }

    get input_NewlineToCarriegeReturn (){
        return this.#hasInputFlag(InputFlag.NewlineToCarriegeReturn);
    }

    get input_IgnoreCarriegeReturn (){
        return this.#hasInputFlag(InputFlag.IgnoreCarriegeReturn);
    }

    get input_CarriegeReturnToNewline (){
        return this.#hasInputFlag(InputFlag.CarriegeReturnToNewline);
    }

    get input_UpperCaseToLowerCase (){
        return this.#hasInputFlag(InputFlag.UpperCaseToLowerCase);
    }

    get input_OutputFlowControl (){
        return this.#hasInputFlag(InputFlag.OutputFlowControl);
    }

    get input_AnyCharRestarts (){
        return this.#hasInputFlag(InputFlag.AnyCharRestarts);
    }

    get input_InputFlowControl (){
        return this.#hasInputFlag(InputFlag.InputFlowControl);
    }

    get input_BellOnFullQueue (){
        return this.#hasInputFlag(InputFlag.BellOnFullQueue);
    }

    get input_UTF8 (){
        return this.#hasInputFlag(InputFlag.UTF8);
    }
}


const accessors = {
    controlFlags : [ Native.Termios_setControlFlags , Native.Termios_getControlFlags ] ,
    outputFlags : [ Native.Termios_setOutputFlags , Native.Termios_getOutputFlags ] ,
    inputFlags : [ Native.Termios_setInputFlags , Native.Termios_getInputFlags ] ,
    localFlags : [ Native.Termios_setLocalFlags , Native.Termios_getLocalFlags ] ,
    // speed : [ Native.Termios_setSpeed , Native.Termios_getSpeed ] ,
    vtime : [ Native.Termios_setVTime , Native.Termios_getVTime ] ,
    vmin : [ Native.Termios_setVMin , Native.Termios_getVMin ] ,
    line : [ Native.Termios_setLine ,  Native.Termios_getLine ]
}


const { defineProperty , entries } = Object;

const { prototype } = Settings;

for(const [ name , [ setter , getter ] ] of entries(accessors))
    defineProperty(prototype,name,{

        get : function ()
            { return getter(this.pointer) },

        set : function ( value )
            { setter(this.pointer,value) }

    });
