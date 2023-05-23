
export { FlowControl } from './Helper/FlowControl.ts'
export { BaudRate } from './Helper/BaudRate.ts'
export { Parity } from './Helper/Parity.ts'


/**
 *  Query the list of available serial ports.
 *  @return An array containing the ports paths.
 */

export { availablePorts } from './API/AvailablePorts.ts'



/**
 *  Try to connect to a serial port.
 *  @param options How & whereto connect.
 *  @return A serial object for further interaction.
 */

export { connect } from './API/Connect.ts'


