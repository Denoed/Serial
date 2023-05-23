
import { mask } from '../Misc/Bits.ts'


export default {

    /**
     *  Ignore BREAK condition on input.
     */

    IgnoreBreaks : mask(0) ,

    /**
     *  If IgnoreBreak is set:
     *  Input & output queues will be flushed
     *  If controlled by a process, SIGINT will be sent.
     *
     *  When neither are set:
     *  BREAK = \0
     *
     *  When PARMRK is set:
     *  BREAK = \377 \0 \0
     */

    InterruptOnBreak : mask(1) ,

    /**
     *  Ignore parity & framing errors.
     */

    IgnoreErrors : mask(2) ,

    /**
     *  Marks parity & framing error bytes with \377 \0
     *  Needs CheckParity enabled & IgnoreErrors disabled.
     */

    MarkErrors : mask(3) ,

    /**
     *  Check parity of the input.
     */

    CheckParity : mask(4) ,

    /**
     *  Strip the 8th bit of each char.
     */

    StripLastBit : mask(5) ,

    /**
     *  Map Newline to Carriege-Return.
     */

    NewlineToCarriegeReturn : mask(6) ,

    /**
     *  Ignore Carriege-Return
     */

    IgnoreCarriegeReturn : mask(7) ,

    /**
     *  Map Carriege-Return to Newline.
     *  Unless IgnoreCarriegeReturn is set.
     */

    CarriegeReturnToNewline : mask(8) ,

    /**
     *  Non-POSIX
     *  Map chars from uppercase to lowercase.
     */

    UpperCaseToLowerCase : mask(9) ,

    /**
     *  Enable toggleable output flow control.
     */

    OutputFlowControl : mask(10) ,

    /**
     *  Make any char restart the output
     *  instead of only the START character.
     */

    AnyCharRestarts : mask(11) ,

    /**
     *  Enable toggleable input flow control.
     */

    InputFlowControl : mask(12) ,

    /**
     *  Non-POSIX
     *  Ring bell when queue is full.
     */

    BellOnFullQueue : mask(13) ,

    /**
     *  Non-POSIX
     *  Chars are UTF-8
     */

    UTF8 : mask(14)
}
