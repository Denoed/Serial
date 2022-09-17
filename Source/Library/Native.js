
import { Buffer , BufReader , readShort }
from 'https://deno.land/std@0.156.0/io/mod.ts'

import Definitions from './Definitions.js'
import Commands from './Commands.js'
import * as Paths from './Paths.js'


const { dlopen , errors } = Deno;
const { Interrupted } = errors;

const { symbols : Native } =
    dlopen(Paths.sharedLibrary,Definitions);



const cString = ( string ) =>
    new TextEncoder()
        .encode(string);


/*
 *  Try to open a serial port.
 */

export async function openPort ( port ){

    const bytes = cString(port);

    return await tryUninterrupted(Native.openPort,bytes);
}


/*
 *  Close a file.
 */

export async function closeFile ( file ){
    return await wrapError(Native.closePort,file);
}


/*
 *  Try to query port information.
 */

export async function portInfo ( file ){

    const data = new Uint8Array(72);

    const success = await Native.deviceCall(file,Commands.QuerySerial,data) + 1;

    const error = await Native.error();

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

async function wrapError ( func , ... parameters ){

    let value = func(...parameters);

    if(value instanceof Promise)
        value = await value;

    return [ value , await Native.error() ]
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
