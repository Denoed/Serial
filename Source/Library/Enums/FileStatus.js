
import { mask as bit } from '../Misc/Bits.js'


export default {

    ReadOnly     : 0 ,

    WriteOnly    : bit(0) ,

    ReadAndWrite : bit(1) ,

    AccessMode   : bit(0) | bit(1) ,

    Append       : bit(13) ,

    NonBlocking  : bit(14)
}
