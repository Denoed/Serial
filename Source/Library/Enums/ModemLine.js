
import { mask as bit } from '../Misc/Bits.js'


export default {

    LineEnable          : bit(0) ,

    DataTerminalReady   : bit(1) ,

    RequestToSend       : bit(2) ,

    SecondaryTransmit   : bit(3) ,

    SecondaryReceive    : bit(4) ,

    ClearToSend         : bit(5) ,

    DataCarrierDetected : bit(6) ,

    Ring                : bit(7) ,

    DataSetReady        : bit(8)

}
