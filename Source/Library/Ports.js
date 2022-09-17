
import { join } from 'https://deno.land/std@0.156.0/path/mod.ts'


const devicePath = ( device ) =>
    join('/','dev',device);


function * ports ( prefix ){
    for(let port = 0;port < 128;port++)
        yield devicePath(`${ prefix }${ port }`);
}


export function * usbPorts (){
    yield * ports('ttyUSB');
}

export function * acmPorts (){
    yield * ports('ttyACM');
}

export function * serialPorts (){
    yield * ports('ttyS');
}

export function * allPorts (){
    yield * serialPorts();
    yield * acmPorts();
    yield * usbPorts();
}
