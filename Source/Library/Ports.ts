
export { serialPorts , allPorts , usbPorts , acmPorts }

import { Path } from './Imports.ts'

const { join } = Path


const devicePath = ( device : string ) =>
    join('/','dev',device)


function * ports ( prefix : string ){

    for ( let port = 0 ; port < 128 ; port++ )
        yield devicePath(`${ prefix }${ port }`)
}


function * usbPorts (){
    yield * ports('ttyUSB')
}

function * acmPorts (){
    yield * ports('ttyACM')
}

function * serialPorts (){
    yield * ports('ttyS')
}

function * allPorts (){
    yield * serialPorts()
    yield * acmPorts()
    yield * usbPorts()
}
