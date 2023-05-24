
export {
    queryTerminalSettings , updateTerminalSettings , writeTermios ,
    readTermios , deviceCall ,  modifyFile , openPort , readByte ,
    exclusive , closeFile , flushInput , flushOutput , flushIO ,
    readBytes , sleep , availableBytes
}

import { FileDescriptor , Commands , Errors } from './Types/mod.ts'

import Definitions from './Definitions.ts'
import * as Paths from './Paths.ts'


const { dlopen , errors } = Deno;
const { Interrupted } = errors;

const { UnsafePointer , UnsafePointerView } = Deno;

const { symbols : Native } = // @ts-ignore Recursive typings throw error?
    dlopen(Paths.sharedLibrary,Definitions)


async function sleep ( micros : number ){
    await Native.usleep(micros)
}


function readTermios ( settings : Deno.PointerValue ){

    const bytes = new Uint8Array(57);

    Native.readTermios(settings,bytes);

    return bytes;
}

function writeTermios ( settings : Deno.PointerValue , data : Uint8Array ){
    Native.writeTermios(settings,data);
}

const cString = ( string : string ) => {

    const bytes = new TextEncoder()
        .encode(string);

    return new Uint8Array([ ... bytes , 0 ])
}



class SystemError extends Error {

    constructor ( error : string ){
        super(error)
        this.name = `System Error : ${ error }`
    }
}



function exception ( ... debug : any ){

    // console.debug('Exception:',debug)

    const error = Native.error() as keyof typeof Errors;

    return Errors[ error ]
        ?? SystemError 
}


/*
 *  Try to open a serial port.
 */

async function openPort ( port : string ){

    const bytes = cString(port);

    // debug('Port:',port)
    // debug('Bytes:',bytes);

    const [ file , error ] = await
        retry(Native.openPort,bytes);

    if( file < 0 ){
        // console.debug(`Failed to open port`)
        throw new error
    }

    return file
}


async function readByte ( file : FileDescriptor , buffer : Uint8Array ){

    const [ readCount , error ] = await
        retry(Native.readBytes,file,buffer,1);

    if( readCount < 0 ){
        console.debug(`Failed to read byte`)
        throw new error
    }

    return readCount
}

async function readBytes ( file : FileDescriptor , buffer : Uint8Array , byteCount : number ){

    const [ readCount , error ] = await
        retry(Native.readBytes,file,buffer,byteCount)

    if( readCount < 0 && ! ( error instanceof Deno.errors.WouldBlock ) ){
        console.debug(`Failed to read bytes`)
        throw new error
    }

    return readCount
}


/*
 *  Close a file.
 */

function closeFile ( file : FileDescriptor ){

    const success = Native.closePort(file) + 1;

    if(success)
        return;

    throw new (exception(`Failed to close file.`))
}


/*
 *  Try to query port information.
 */

export async function portInfo ( file : FileDescriptor ){

    const data = new 
        Uint8Array(72)

    await deviceCall(file,Commands.QuerySerial,data)

    return data
}


async function availableBytes ( file : FileDescriptor ){

    const bytes = new 
        Uint8Array(4)

    await deviceCall(file,Commands.AvailableBytes,bytes)

    const pointer = 
        UnsafePointer.of(bytes)

    const view = new 
        UnsafePointerView(pointer!)

    return view
        .getInt32()
}


/*
 *  Try to make process exclusive.
 */

async function exclusive ( file : FileDescriptor ){
    await deviceCall(file,Commands.ExclusiveAccess)
}



async function flushInput ( file : FileDescriptor ){
    if( await Native.Terminal_flush(file,0) === -1 )
        throw new (exception(`Failed to flush input`))
}

async function flushOutput ( file : FileDescriptor ){
    if( await Native.Terminal_flush(file,1) === -1 )
        throw new (exception(`Failed to flush output`))
}

async function flushIO ( file : FileDescriptor ){
    if( await Native.Terminal_flush(file,2) === -1)
        throw new (exception(`Failed to flush output`))
}


type DropFirst< Type extends Array<unknown> > = Type extends [ any , ... infer U ] ? U : never

type RestFunction = ( ... args : any ) => any

type SecondPlus < Type extends RestFunction > = DropFirst<Parameters<Type>>


/*
 *  Try to query a terminals settings.
 */

async function queryTerminalSettings ( file : FileDescriptor ){

    const
        settings = new Uint8Array(60) ,
        pointer = UnsafePointer.of(settings) ;

    const [ success , error ] = await
        retry(Native.queryTerminalSettings,file,pointer)

    if( success === -1 ){
        console.debug(`Failed to query terminal settings`)
        throw new error
    }

    return [ settings , pointer ]
}


/*
 *  Try to update a terminals settings.
 */

async function updateTerminalSettings ( file : FileDescriptor , settings : Deno.PointerValue ){

    const [ success , error ] = await
        retry(Native.updateTerminalSettings,file,settings);

    if( success === -1 ){
        console.debug(`Failed to update terminal settings`)
        throw new error
    }
}


/*
 *  IOCTL | Instruct a device driver.
 */

async function deviceCall ( ... args : SecondPlus<typeof command> ){
    return await command(Native.deviceCall,...args)
}


/*
 *  FCNTL | Modify a file descriptor.
 */

async function modifyFile ( ... args : SecondPlus<typeof command> ){
    return await command(Native.modifyFile,...args)
}


type CommandFunction = ( ... args : [ FileDescriptor , number , any ] ) => any 

async function command ( command : CommandFunction , file : FileDescriptor , instruction : number , data ?: any ){

    const [ success , error ] = await
        retry(command,file,instruction,data ?? null)

    if( success === -1 ){
        console.debug(`Failed to execute command`)
        throw new error
    }
}


/*
 *  Continuously try calling the
 *  function if it is interrupted.
 */

async function retry < Parameters extends Array<any> > ( func : ( ... args : Parameters ) => Promise<number> , ... parameters : Parameters ){

    let result , error ;

    do {

        result = await func( ... parameters )
        error = exception(func,...parameters)

    } while ( result < 0 && error instanceof Interrupted );

    return [ result , error ] as const
}