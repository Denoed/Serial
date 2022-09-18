

import listPorts from './API/AvailablePorts.js'


/**
 *  Query the list of available serial ports.
 *  @return An array containing the ports paths.
 */

export async function availablePorts () : Promise < string [] > {
    return listPorts() as Promise < string [] >;
}


export { FlowControl } from './Helper/FlowControl.ts'
export { BaudRate } from './Helper/BaudRate.ts'
export { Parity } from './Helper/Parity.ts'

import SerialPort from './SerialPort.js'
export { SerialPort } 