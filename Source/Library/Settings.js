
import { updateTerminalSettings , queryTerminalSettings } from './Native.ts'
import { readTermios , writeTermios } from './Native.ts'
import { encode } from './Encoding/TermiosEncoder.js'

import decode from './Encoding/TermiosDecoder.js'


export default class Settings {

    #settings;
    #pointer;
    #data;

    static async of ( file ){

        const [ data , pointer ] = await
            queryTerminalSettings(file)

        const settings = decode(readTermios(pointer));

        return new Settings(settings,data,pointer);
    }

    constructor ( settings , data , pointer ){
        this.#settings = settings;
        this.#pointer = pointer;
        this.#data = data;
    }


    get pointer (){
        return this.#pointer
    }

    get all (){
        return this.#settings
    }

    get controlCharacters (){
        return this.#settings.controlCharacters
    }

    get flags (){
        return this.#settings.flags
    }

    get modemLine (){
        return this.#settings.modemLine
    }

    get characterSize (){
        return this.#settings.characterSize
    }

    get delays (){
        return this.#settings.delays
    }

    get speed (){
        return this.#settings.speed
    }

    async writeTo ( file ){

        writeTermios(this.#pointer,encode(this.#settings))

        await updateTerminalSettings(file,this.#pointer)
    }
}
