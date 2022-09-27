
import AvailablePorts from './API/AvailablePorts.js'
import Connect from './API/Connect.js'


/**
 *  Query the list of available serial ports.
 *  @return An array containing the ports paths.
 */

export async function availablePorts () : Promise < string [] > {
    return AvailablePorts () as Promise < string [] >;
}


/**
 *  Try to connect to a serial port.
 *  @param options How & whereto connect.
 *  @return A serial object for futher interaction.
 */

export async function connect ( options : object ) : Promise < object > {
    return Connect ( options ) as Promise < object >;
}


export { FlowControl } from './Helper/FlowControl.ts'
export { BaudRate } from './Helper/BaudRate.ts'
export { Parity } from './Helper/Parity.ts'

