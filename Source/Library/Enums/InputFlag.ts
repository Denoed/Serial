
function bit ( position : number ) : number {
    return 1 << position;
}


export enum InputFlag {

    /**
     *  Ignore BREAK condition on input.
     */

    IgnoreBreaks            = bit(0) ,

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

    InterruptOnBreak        = bit(1) ,

    /**
     *  Ignore parity & framing errors.
     */

    IgnoreErrors            = bit(2) ,

    /**
     *  Marks parity & framing error bytes with \377 \0
     *  Needs CheckParity enabled & IgnoreErrors disabled.
     */

    MarkErrors              = bit(3) ,

    /**
     *  Check parity of the input.
     */

    CheckParity             = bit(4) ,

    /**
     *  Strip the 8th bit of each char.
     */

    StripLastBit            = bit(5) ,

    /**
     *  Map Newline to Carriege-Return.
     */

    NewlineToCarriegeReturn = bit(6) ,

    /**
     *  Ignore Carriege-Return
     */

    IgnoreCarriegeReturn    = bit(7) ,

    /**
     *  Map Carriege-Return to Newline.
     *  Unless IgnoreCarriegeReturn is set.
     */

    CarriegeReturnToNewline = bit(8) ,

    /**
     *  Non-POSIX
     *  Map chars from uppercase to lowercase.
     */

    UpperCaseToLowerCase    = bit(9) ,

    /**
     *  Enable toggleable output flow control.
     */

    OutputFlowControl       = bit(10) ,

    /**
     *  Make any char restart the output
     *  instead of only the START character.
     */

    AnyCharRestarts         = bit(11) ,

    /**
     *  Enable toggleable input flow control.
     */

    InputFlowControl        = bit(12) ,

    /**
     *  Non-POSIX
     *  Ring bell when queue is full.
     */

    BellOnFullQueue         = bit(13) ,

    /**
     *  Non-POSIX
     *  Chars are UTF-8
     */

    UTF8                    = bit(14)
}
