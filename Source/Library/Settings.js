
import Definitions from './Definitions.js'
import * as Paths from './Paths.js'


const { dlopen , errors } = Deno;
const { log } = console;

const { symbols : Native } =
    dlopen(Paths.sharedLibrary,Definitions);


import { updateTerminalSettings , queryTerminalSettings } from './Native.js'


export default class Settings {

    #settings;
    #pointer;

    static async of ( file ){
        const [ settings , pointer ] = await queryTerminalSettings(file);
        return new Settings(settings,pointer);
    }

    constructor ( settings , pointer ){
        this.#settings = settings;
        this.#pointer = pointer;
    }


    log (){
        log('Settings',this.#pointer);
    }

    async writeTo ( file ){
        await updateTerminalSettings(file,this.#pointer);
    }


    set line ( line ){
        Native.Termios_setLine(this.#pointer,line);
    }

    set speed ( speed ){
        Native.Termios_setSpeed(this.#pointer,speed);
    }

    set inputFlags ( flags ){
        Native.Termios_setInputFlags(this.#pointer,flags);
    }

    set outputFlags ( flags ){
        Native.Termios_setOutputFlags(this.#pointer,flags);
    }

    set controlFlags ( flags ){
        Native.Termios_setControlFlags(this.#pointer,flags);
    }

    set localFlags ( flags ){
        Native.Termios_setLocalFlags(this.#pointer,flags);
    }

    set vmin ( minimum ){
        Native.Termios_setVMin(this.#pointer,minimum);
    }

    set vtime ( time ){
        Native.Termios_setVTime(this.#pointer,time);
    }





    get inputFlags (){
        return Native.Termios_getInputFlags(this.#pointer);
    }

    get outputFlags (){
        return Native.Termios_getOutputFlags(this.#pointer);
    }

    get controlFlags (){
        return Native.Termios_getControlFlags(this.#pointer);
    }

    get localFlags (){
        return Native.Termios_getLocalFlags(this.#pointer);
    }


    get outputSpeed (){
        return Native.Termios_getOutputSpeed(this.#pointer);
    }

    get inputSpeed (){
        return Native.Termios_getInputSpeed(this.#pointer);
    }

    get vmin (){
        return Native.Termios_getVMin(this.#pointer);
    }

    get vtime (){
        return Native.Termios_getVTime(this.#pointer);
    }


    controlChar (type){
        return Native.Termios_getControlChar(this.#pointer,type);
    }
}
