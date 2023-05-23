
import { mask as bit } from '../Misc/Bits.ts'


export default {

    /**
     *  Implementation defined processing.
     */

    PostProcess             : bit(0) ,

    /**
     *  Non-POSIX
     *  LowerCase -> UpperCase
     */

    LowerToUpper            : bit(1) ,

    /**
     *  Prepend Carriege-Return before Newline.
     */

    PrependCarriegeReturn   : bit(2) ,

    /**
     *  Carriege-Return -> Newline
     */

    CarriegeReturnToNewline : bit(3) ,

    /**
     *  Don't output Carriege-Return for the 0th column.
     */

    DelayCarriegeReturn     : bit(4) ,

    /**
     *  Doesn't output Carriege-Return.
     */

    NoCarriegeReturn        : bit(5) ,

    /**
     *  Delay by sending fill chars instead of waiting.
     */

    DelayViaFill            : bit(6) ,

    /**
     *  Non-Linux
     *  Use char 177 instead of char 0 as fill char.
     */

    FillIsDelete            : bit(7)

}
