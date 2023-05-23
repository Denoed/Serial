
export { availablePorts }

import { allPorts } from '../Ports.ts'
import * as Serial from '../Native.js'


const { NotFound } = Deno.errors;


async function * availablePorts (){

    for ( const port of allPorts() )
        if( await isAvailable(port) )
            yield port
}


/*
 *  Is the port endpoint present?
 *  Is the port endpoint readable?
 */

async function isAvailable ( port : string ){

    try {

        const file = await Serial.openPort(port);

        try {

            await Serial.portInfo(file);
            return true;

        } catch (error) {

            error.stack = 'IOCTL Serial Reading Error\n' + error.stack;
            throw error;

        } finally {
            Serial.closeFile(file);
        }
    } catch (error) {

        if(error instanceof NotFound)
            return false;

        throw error;
    }
}
