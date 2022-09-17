
import { Buffer , BufReader , readShort }
from 'https://deno.land/std@0.156.0/io/mod.ts'

import { fromFileUrl , dirname , join }
from 'https://deno.land/std@0.156.0/path/mod.ts'

import Definitions from './Definitions.js'
import Commands from './Commands.js'


const { dlopen , errors } = Deno;
const { Interrupted } = errors;

const
    folder = dirname(fromFileUrl(import.meta.url)) ,
    serial = join(folder,'Serial.so') ;

const { symbols : Native } = dlopen(serial,Definitions);


const cString = ( string ) =>
    new TextEncoder()
        .encode(string);


/*
 *  Try to open a serial port.
 */

export async function openPort ( port ){

    const bytes = cString(port);

    return await tryUninterrupted(Native.openSerialPort,bytes);
}


/*
 *  Close a file.
 */

export async function closeFile ( file ){
    return await wrapError(Native.closeSerialPort,file);
}


/*
 *  Try to query port information.
 */

export async function portInfo ( file ){

    const data = new Uint8Array(72);

    const success = await Native.deviceCall(file,Commands.QuerySerial,data) + 1;

    const error = await Native.exception();

    if(success)
        return [ data , error ];

    return [ -1 , error ];
}


/*
 *  IOCTL | Instruct a device driver
 */

export async function deviceCall ( file , command , data ){
    return Native.deviceCall(file,command,data);
}


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
 *  Continuosly try calling the
 *  function if it is interrupted.
 */

async function tryUninterrupted ( ... args ){

    let value , error ;

    do { [ value , error ] = await wrapError(...args); }
    while ( value === -1 && error === Interrupted );

    return [ value , error ];
}
