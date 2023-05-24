
export { availablePorts }

import { openPort , portInfo , closeFile } from '../Native.ts'
import { allPorts } from '../Ports.ts'


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

        const file = await 
            openPort(port)

        let success = false;

        try {

            await portInfo(file)
            
            success = true;

        } catch ( exception ){

            exception.stack = 'IOCTL Serial Reading Error\n' + exception.stack;

            throw exception

        } finally {
            closeFile(file)
        }

        return success

    } catch ( exception ){

        if( exception instanceof NotFound )
            return false

        throw exception
    }
}
