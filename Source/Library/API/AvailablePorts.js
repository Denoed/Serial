
import { allPorts } from '../Ports.js'
import * as Serial from '../Native.js'


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

    const [ file ] = await Serial.openPort(port);

    if(file < 1)
        return false;

    try {

        const [ data , error ] = await Serial.portInfo(file);

        // log('Info',port,data,error,exception());

        if(data)
            return true;

        throw `Unknown IOCTL Serial Reading Error : ${ error }`;

    } catch (exception) {

        const [ result , error ] = await
            Serial.closeFile(file);

        if(result !== 0)
            throw `Wasn't able to close Serial Port file descriptor : ${ error }`;

        throw exception;
    }
}
