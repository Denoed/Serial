
import Definitions from './Definitions.js'
import * as Paths from './Paths.js'


const { dlopen , errors } = Deno;
const { log } = console;

const { symbols : Native } =
    dlopen(Paths.sharedLibrary,Definitions);


import ControlFlag from './Enums/ControlFlag.js'
import { InputFlag } from './Enums/InputFlag.ts'



import { updateTerminalSettings , queryTerminalSettings } from './Native.js'



function u32 ( bytes ){
    return bytes[0] <<  0
         | bytes[1] <<  8
         | bytes[2] << 16
         | bytes[3] << 24 ;
}

import { readTermios , writeTermios } from './Native.js'
import decode from './Encoding/TermiosDecoder.js'
import encode from './Encoding/TermiosEncoder.js'

export default class Settings {

    #settings;
    #pointer;
    #data;

    static async of ( file ){

        const [ data , pointer ] = await queryTerminalSettings(file);

        const settings = decode(readTermios(pointer));

        log(settings);

        return new Settings(settings,data,pointer);
    }

    constructor ( settings , data , pointer ){
        this.#settings = settings;
        this.#pointer = pointer;
        this.#data = data;
    }


    get pointer (){
        return this.#pointer;
    }

    get all (){
        return this.#settings;
    }

    get controlCharacters (){
        return this.#settings.controlCharacters;
    }

    get flags (){
        return this.#settings.flags;
    }

    get modemLine (){
        return this.#settings.modemLine;
    }

    get characterSize (){
        return this.#settings.characterSize;
    }

    get delays (){
        return this.#settings.delays;
    }

    get speed (){
        return this.#settings.speed;
    }

    async writeTo ( file ){
        writeTermios(this.#pointer,encode(this.#settings));
        await updateTerminalSettings(file,this.#pointer);
    }
    //
    //
    //
    // set speed ( speed ){
    //     this.#settings.speed.output =
    //     this.#settings.speed.input =
    //         speed;
    //     // Native.Termios_setSpeed(this.#pointer,speed);
    // }
    //
    // get outputSpeed (){
    //     return this.#settings.speed.output;
    //     // return Native.Termios_getOutputSpeed(this.#pointer);
    // }
    //
    // get inputSpeed (){
    //     return this.#settings.speed.input;
    //     // return Native.Termios_getInputSpeed(this.#pointer);
    // }
    //
    //
    //
    // controlChar (type){
    //     return this.#settings.controlCharacters[type];
    //     // return Native.Termios_getControlChar(this.#pointer,type);
    // }

    //
    // #hasControlFlag ( flag ){
    //     return (this.controlFlags & flag) > 0
    // }
    //
    // #hasInputFlag ( flag ){
    //     return (this.inputFlags & flag) > 0
    // }


    // /**
    //  *  Control Flags
    //  */
    //
    // get characterSize (){
    //
    //     let { controlFlags } = this;
    //     controlFlags &= ControlFlag.CharacterSize;
    //     controlFlags >>= 5;
    //     controlFlags += 5;
    //     return controlFlags;
    // }
    //
    // get doubleStopBits (){
    //     return this.#hasControlFlag(ControlFlag.DoubleStopBits);
    // }
    //
    // get canRead (){
    //     return this.#hasControlFlag(ControlFlag.Read);
    // }
    //
    // get usesParity (){
    //     return this.#hasControlFlag(ControlFlag.ParityEnabled);
    // }
    //
    // get oddParity (){
    //     return this.#hasControlFlag(ControlFlag.OddParity);
    // }
    //
    // get hangsUp (){
    //     return this.#hasControlFlag(ControlFlag.HangUp);
    // }
    //
    // get isLocal (){
    //     return this.#hasControlFlag(ControlFlag.Local);
    // }


    // /**
    //  *  Input Flags
    //  */
    //
    // get input_IgnoreBreaks (){
    //     return this.#hasInputFlag(InputFlag.IgnoreBreaks);
    // }
    //
    // get input_InterruptOnBreak (){
    //     return this.#hasInputFlag(InputFlag.InterruptOnBreak);
    // }
    //
    // get input_IgnoreErrors (){
    //     return this.#hasInputFlag(InputFlag.IgnoreErrors);
    // }
    //
    // get input_MarkErrors (){
    //     return this.#hasInputFlag(InputFlag.MarkErrors);
    // }
    //
    // get input_CheckParity (){
    //     return this.#hasInputFlag(InputFlag.CheckParity);
    // }
    //
    // get input_StripLastBit (){
    //     return this.#hasInputFlag(InputFlag.StripLastBit);
    // }
    //
    // get input_NewlineToCarriegeReturn (){
    //     return this.#hasInputFlag(InputFlag.NewlineToCarriegeReturn);
    // }
    //
    // get input_IgnoreCarriegeReturn (){
    //     return this.#hasInputFlag(InputFlag.IgnoreCarriegeReturn);
    // }
    //
    // get input_CarriegeReturnToNewline (){
    //     return this.#hasInputFlag(InputFlag.CarriegeReturnToNewline);
    // }
    //
    // get input_UpperCaseToLowerCase (){
    //     return this.#hasInputFlag(InputFlag.UpperCaseToLowerCase);
    // }
    //
    // get input_OutputFlowControl (){
    //     return this.#hasInputFlag(InputFlag.OutputFlowControl);
    // }
    //
    // get input_AnyCharRestarts (){
    //     return this.#hasInputFlag(InputFlag.AnyCharRestarts);
    // }
    //
    // get input_InputFlowControl (){
    //     return this.#hasInputFlag(InputFlag.InputFlowControl);
    // }
    //
    // get input_BellOnFullQueue (){
    //     return this.#hasInputFlag(InputFlag.BellOnFullQueue);
    // }
    //
    // get input_UTF8 (){
    //     return this.#hasInputFlag(InputFlag.UTF8);
    // }
}

//
// const accessors = {
//     controlFlags : [ Native.Termios_setControlFlags , Native.Termios_getControlFlags ] ,
//     outputFlags : [ Native.Termios_setOutputFlags , Native.Termios_getOutputFlags ] ,
//     inputFlags : [ Native.Termios_setInputFlags , Native.Termios_getInputFlags ] ,
//     localFlags : [ Native.Termios_setLocalFlags , Native.Termios_getLocalFlags ] ,
//     // speed : [ Native.Termios_setSpeed , Native.Termios_getSpeed ] ,
//     vtime : [ Native.Termios_setVTime , Native.Termios_getVTime ] ,
//     vmin : [ Native.Termios_setVMin , Native.Termios_getVMin ] ,
//     line : [ Native.Termios_setLine ,  Native.Termios_getLine ]
// }
//
//
// const { defineProperty , entries } = Object;
//
// const { prototype } = Settings;
//
// for(const [ name , [ setter , getter ] ] of entries(accessors))
//     defineProperty(prototype,name,{
//
//         get : function ()
//             { return getter(this.pointer) },
//
//         set : function ( value )
//             { setter(this.pointer,value) }
//
//     });
