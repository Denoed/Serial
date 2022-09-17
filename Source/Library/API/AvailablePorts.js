
import { allPorts } from '../Ports.js'
import * as Serial from '../Native.js'

const { NotFound } = Deno.errors;
const { log } = console;



export default async function listPorts (){

    const ports = [];

    for(const port of allPorts())
        if(await isAvailable(port))
            ports.push(port);

    return ports;
}


/*
 *  Is the port endpoint present?
 *  Is the port endpoint readable?
 */

async function isAvailable ( port ){

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
