
import Definitions from './Definitions.js'
import Commands from './Commands.js'
import Errors from './Errors.js'
import * as Paths from './Paths.js'


const { dlopen , errors } = Deno;
const { Interrupted } = errors;
const { log } = console;

const { symbols : Native } =
    dlopen(Paths.sharedLibrary,Definitions);



const cString = ( string ) =>
    new TextEncoder()
        .encode(string);


function exception (){

    const error = Native.error();

    const exception = (error in Errors)
        ? new Errors[error]
        : new Error(`System Error : ${ error }`) ;

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

    const [ file , error ] = await
        retry(Native.openPort,bytes);

    if(file < 0)
        throw error;

    return file;
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

    const [ success , error ] = await
        retry(deviceCall,file,Commands.QuerySerial,data);

    if(success !== -1)
        return data;

    throw error;
}


/*
 *  IOCTL | Instruct a device driver
 */

export async function deviceCall ( file , command , data ){
    return Native.deviceCall(file,command,data);
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
