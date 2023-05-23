
export { FlowControl } from './Helper/FlowControl.ts'
export { BaudRate } from './Helper/BaudRate.ts'
export { Parity } from './Helper/Parity.ts'

export { availablePorts , connect }

import { connect as internalConnect } from './API/Connect.js'
import AvailablePorts from './API/AvailablePorts.js'


/**
 *  Query the list of available serial ports.
 *  @return An array containing the ports paths.
 */

function availablePorts (){
    return AvailablePorts() as Promise < string [] >
}


/**
 *  Try to connect to a serial port.
 *  @param options How & whereto connect.
 *  @return A serial object for futher interaction.
 */

function connect ( options : object ){
    return internalConnect( options ) as Promise < object >
}




