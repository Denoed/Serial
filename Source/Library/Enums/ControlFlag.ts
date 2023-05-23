
import { mask as bit } from '../Misc/Bits.ts'


export default {

    /**
     *  Use 2 stop bits instead of 1.
     */

    DoubleStopBits : bit(6) ,

    /**
     *  Enable the receiver.
     */

    Read           : bit(7) ,

    /**
     *  Generate parity for output.
     *  Check parity for input.
     */

    ParityEnabled  : bit(8) ,

    /**
     *  Input & output will use odd parity.
     */

    OddParity      : bit(9) ,

    /**
     *  Lower modem control lines after the
     *  last process closes the device.
     */

    HangUp         : bit(10) ,

    /**
     *  Ignore modem control lines.
     */

    Local          : bit(11) ,

    /**
     *  Non-POSIX
     *  Use 'Stick' ( Mark / Spac ) parity.
     *  Parity Bit = (OddParity) ? 1 : 0
     */

    StickParity    : bit(30) ,

    /**
     *  Hardware flow control.
     */

    HardwareFlow   : bit(31)

}
