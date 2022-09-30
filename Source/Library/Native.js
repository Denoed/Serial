
import Definitions from './Definitions.js'
import Commands from './Enums/Commands.js'
import Errors from './Enums/Errors.js'
import * as Paths from './Paths.js'

import { OperationWouldBlock } from './Enums/Errors.js'

const { dlopen , errors } = Deno;
const { Interrupted } = errors;
const { log } = console;

const { UnsafePointer , UnsafePointerView } = Deno;

const { symbols : Native } =
    dlopen(Paths.sharedLibrary,Definitions);


export async function sleep ( micros ){
    await Native.usleep(micros);
}


export function readTermios ( settings ){

    const bytes = new Uint8Array(57);

    Native.readTermios(settings,bytes);

    return bytes;
}

export function writeTermios ( settings , data ){
    Native.writeTermios(settings,bytes);
}

const cString = ( string ) =>
    new TextEncoder()
        .encode(string);


function exception (){

    const error = Native.error();

    let exception = new Error(`System Error : ${ error }`);

    if(error in Errors)
        exception = new Errors[error];

    exception.stack = exception.stack
        .split('\n')
        .filter((_,index) => index !== 1)
        .join('\n');

    return exception;

    // if(error in Errors)
    //     return new Errors[error];
    //
    // return new Error(`System Error : ${ error }`);
}


/*
 *  Try to open a serial port.
 */

export async function openPort ( port ){

    const bytes = cString(port);

    log(port,bytes);

    const [ file , error ] = await
        retry(Native.openPort,bytes);

    if(file < 0)
        throw error;

    return file;
}


export async function readByte ( file , buffer , byteCount ){

    const [ readCount , error ] = await
        retry(Native.readByte,file,buffer,byteCount);

    if(readCount < 0)
        throw error;

    return readCount;
}

export async function readBytes ( file , pointer , byteCount ){

    const [ readCount , error ] = await
        retry(Native.readBytes,file,pointer,byteCount);

    if(readCount < 0 && !(error instanceof OperationWouldBlock))
        throw error;

    return readCount;
}


/*
 *  Close a file.
 */

export function closeFile ( file ){

    const success = Native.closePort(file) + 1;

    if(success)
        return;

    throw exception();
}


/*
 *  Try to query port information.
 */

export async function portInfo ( file ){

    const data = new Uint8Array(72);

    await deviceCall(file,Commands.QuerySerial,data);

    return data;
}


export async function availableBytes ( file ){

    const bytes = new Uint8Array(4);

    await deviceCall(file,Commands.AvailableBytes,bytes);

    return new UnsafePointerView(UnsafePointer.of(bytes))
        .getInt32();
}


/*
 *  Try to make process exclusive.
 */

export async function exclusive ( file ){
    await deviceCall(file,Commands.ExclusiveAccess);
}



export async function flushInput ( file ){
    if(await Native.Terminal_flush(file,0) === -1)
        throw exception();
}

export async function flushOutput ( file ){
    if(await Native.Terminal_flush(file,1) === -1)
        throw exception();
}

export async function flushIO ( file ){
    if(await Native.Terminal_flush(file,2) === -1)
        throw exception();
}


/*
 *  Try to query a terminals settings.
 */

export async function queryTerminalSettings ( file ){

    const
        settings = new Uint8Array(60) ,
        pointer = UnsafePointer.of(settings) ;

    const [ success , error ] = await
        retry(Native.queryTerminalSettings,file,pointer);

    if(success === -1)
        throw error;

    return [ settings , pointer ];
}


/*
 *  Try to update a terminals settings.
 */

export async function updateTerminalSettings ( file , settings ){

    const [ success , error ] = await
        retry(Native.updateTerminalSettings,file,settings);

    if(success !== -1)
        return;

    throw error;
}


/*
 *  IOCTL | Instruct a device driver.
 */

export async function deviceCall ( ... args ){
    return await command(Native.deviceCall,...args);
}


/*
 *  FCNTL | Modify a file descriptor.
 */

export async function modifyFile ( ... args ){
    return await command(Native.modifyFile,...args);
}


async function command ( command , file , instruction , data ){

    const [ success , error ] = await
        retry(command,file,instruction,data ?? null);

    if(success === -1)
        throw error;
}


/*
 *  Continuosly try calling the
 *  function if it is interrupted.
 */

async function retry ( func , ... parameters ){

    let result , error ;

    do {
        result = await func(...parameters);
        error = exception();
    } while ( result < 0 && error instanceof Interrupted );

    return [ result , error ];
}
