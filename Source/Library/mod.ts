
export { FlowControl } from './Helper/FlowControl.ts'
export { BaudRate } from './Helper/BaudRate.ts'
export { Parity } from './Helper/Parity.ts'

export { availablePorts }

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
 *  @return A serial object for further interaction.
 */

export { connect } from './API/Connect.ts'


