
import { updateTerminalSettings , queryTerminalSettings } from './Native.js'
import { readTermios , writeTermios } from './Native.js'
import { InputFlag } from './Enums/InputFlag.ts'
import ControlFlag from './Enums/ControlFlag.js'
import Definitions from './Definitions.js'
import * as Paths from './Paths.js'
import decode from './Encoding/TermiosDecoder.js'
import encode from './Encoding/TermiosEncoder.js'


const { dlopen , errors } = Deno;
const { debug } = console;

const { symbols : Native } =
    dlopen(Paths.sharedLibrary,Definitions);


export default class Settings {

    #settings;
    #pointer;
    #data;

    static async of ( file ){

        const [ data , pointer ] = await queryTerminalSettings(file);

        const settings = decode(readTermios(pointer));

        // log(settings);

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
}
