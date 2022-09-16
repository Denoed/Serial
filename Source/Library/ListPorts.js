
import { Buffer , BufReader , readShort } from 'https://deno.land/std/io/mod.ts'
import { fromFileUrl , dirname , join } from 'https://deno.land/std/path/mod.ts'
import Definitions from './Native.js'

const { dlopen } = Deno;
const { log } = console;


const portRange = 128;

const locations = [
    'ttyUSB' ,
    'ttyACM' ,
    'ttyS'
]


const
    folder = dirname(fromFileUrl(import.meta.url)) ,
    serial = join(folder,'Serial.so') ;

const { closeSerialPort , openSerialPort , serialInfo } =
    dlopen(serial,Definitions).symbols;



async function bytesToNumber ( bytes ){
    return await readShort(new BufReader(new Buffer(bytes)));
}



async function wrapError ( func , ... parameters ){

    let
        error = new Uint8Array(4) ,
        value = func(...parameters,error) ;

    if(value instanceof Promise)
        value = await value;

    return [ value , await bytesToNumber(error) ]
}


/*
 *  Continues try calling the
 *  function if it is interrupted.
 */

async function tryUninterrupted( ... args ){

    let value , error ;

    do {
        [ value , error ] = await wrapError(...args);
    } while ( value === -1 && error === 4 );

    return [ value , error ];
}

export default async function listPorts (){

    const ports = [];

    for(const location of locations)
        for(let port = 0;port < 128;port++){

            const
                path = join('/','dev',`${ location }${ port }`) ,
                path_bytes = new TextEncoder().encode(path) ;

            const [ descriptor ] = await tryUninterrupted(openSerialPort,path_bytes);

            if(descriptor < 1)
                continue;

            try {

                const data = new Uint8Array(72);

                const [ result , error ] = await tryUninterrupted(serialInfo,descriptor,data);

                // log('Info',path,result,error,data);

                if(result)
                    ports.push(path);
                else {
                    throw `Unknown IOCTL Serial Reading Error : ${ error }`;
                }

            } catch (e) { console.error(e); }


            const [ result , error ] = await wrapError(closeSerialPort,descriptor);

            if(result !== 0)
                throw `Wasn't able to close Serial Port file descritor : ${ error }`;
        }

    return ports;
}
