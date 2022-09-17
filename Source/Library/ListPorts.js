
import { Buffer , BufReader , readShort } from 'https://deno.land/std/io/mod.ts'
import { fromFileUrl , dirname , join } from 'https://deno.land/std/path/mod.ts'
import Definitions from './Native.js'

const { dlopen } = Deno;
const { log } = console;


const
    folder = dirname(fromFileUrl(import.meta.url)) ,
    serial = join(folder,'Serial.so') ;

const { closeSerialPort , openSerialPort , serialInfo , exception } =
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
 *  Continuosly try calling the
 *  function if it is interrupted.
 */

async function tryUninterrupted ( ... args ){

    let value , error ;

    do { [ value , error ] = await wrapError(...args); }
    while ( value === -1 && error === 4 );

    return [ value , error ];
}


const cString = ( string ) =>
    new TextEncoder()
        .encode(string);


async function isAvailable ( port ){

    const path_bytes = cString(port);

    const [ descriptor ] = await
        tryUninterrupted(openSerialPort,path_bytes);

    if(descriptor < 1)
        return false;

    try {

        const data = new Uint8Array(72);

        const [ result , error ] = await
            tryUninterrupted(serialInfo,descriptor,data);

        // log('Info',port,result,data,error,exception());

        if(result)
            return true;

        throw `Unknown IOCTL Serial Reading Error : ${ error }`;

    } catch (exception) {

        const [ result , error ] = await
            wrapError(closeSerialPort,descriptor);

        if(result !== 0)
            throw `Wasn't able to close Serial Port file descritor : ${ error }`;

        throw exception;
    }
}


const devicePath = ( device ) =>
    join('/','dev',device);


function * ports ( prefix ){
    for(let port = 0;port < 128;port++)
        yield devicePath(`${ prefix }${ port }`);
}

function * usbPorts (){
    yield * ports('ttyUSB');
}

function * acmPorts (){
    yield * ports('ttyACM');
}

function * serialPorts (){
    yield * ports('ttyS');
}

function * allPorts (){
    yield * serialPorts();
    yield * acmPorts();
    yield * usbPorts();
}


export default async function listPorts (){

    const ports = [];

    for(const port of allPorts())
        if(await isAvailable(port))
            ports.push(port);

    return ports;
}
