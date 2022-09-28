
const bit = ( position ) =>
    1 << position;


export default {

    /**
     *  2 bit character size : 5 - 8 bits
     */

    CharacterSize  : bit(6) | bit(5) ,

    /**
     *  Use 2 stop bits instead of 1.
     */

    DoubleStopBits : bit(8) ,

    /**
     *  Enable the receiver.
     */

    Read           : bit(9) ,

    /**
     *  Generate parity for output.
     *  Check parity for input.
     */

    ParityEnabled  : bit(10) ,

    /**
     *  Input & output will use odd parity.
     */

    OddParity      : bit(12) ,

    /**
     *  Lower modem control lines after the
     *  last process closes the device.
     */

    HangUp         : bit(13) ,

    /**
     *  Ignore modem control lines.
     */

    Local          : bit(14)

}
