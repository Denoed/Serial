
const bit = ( position ) =>
    1 << position;


export default {

    /**
     *  Generate signals for received chars:
     *  -   De-suspend
     *  -   Interrupt
     *  -   Suspend
     *  -   Quit
     */

    EnableSignals : bit(0) ,

    /**
     *  Enable canonical mode.
     */

    Canonical     : bit(1) ,

    /**
     *  Non-POSIX
     *  If Canonical is set:
     *  Terminal is uppercase only.
     *
     *  Input:
     *  \ + Any -> Any
     *  Any -> LowerCase
     *
     *  Output:
     *  UpperCase -> \ + UpperCase
     *  LowerCase -> UpperCase
     */

    UpperCaseOnly : bit(2) ,

    /**
     *  Echo input
     */

    Echo          : bit(4) ,

    /**
     *  If Canonical is set:
     *  Preceding char is erased with ERASE
     *  Preceding word is erased with WERASE
     */

    EchoErase     : bit(5) ,

    /**
     *  If Canonical is set:
     *  Current line is erased with KILL
     */

    EchoKill      : bit(6) ,

    /**
     *  If Canonical is set:
     *  Echos newline chars
     */

    EchoNewline   : bit(8) ,

    /**
     *  Disable flushing input & output
     *  queues for signal generation.
     *
     *  Signals:
     *  - Interrupt
     *  - Suspend
     *  - Quit
     */

    DontFlush : bit(9) ,

    /**
     *  Sends SIGTTOU to background process.
     */

    StopOutput : bit(10) ,

    /**
     *  Non-POSIX
     *  If Echo is set:
     *  Special chars are echoed as 0x5E char + 0x40
     *  This doesn't include:
     *  Tab Newline Start Stop
     */

    EchoControl : bit(12) ,

    /**
     *  Non-POSIX
     *  If Canonical & Echo are set:
     *  Chars are printed as they are being erased.
     */

    EchoPrint : bit(13) ,

    /**
     *  Non-POSIX
     *  If Canonical is set:
     *  KILL is echoed when erasing a char on the
     *  line, defined by EchoErase & EchoPrint.
     */

    Choke : bit(14) ,

    /**
     *  Non-POSIX
     *  Flushes the output.
     *  Toggled by sending the Discard char.
     */

    FlushOutput : bit(16) ,

    /**
     *  Non-POSIX
     *  All chars from the input queue are
     *  reprinted once the next char is read.
     */

    ReprintInput : bit(18) ,

    /**
     *  Enable implementation defined input processsing.
     *  If this & canonical are set:
     *  End-Of-Line-2 LNext Reprint WErase are interpreted.
     *  IUCLC flag will be effective.
     */

    ExtentedInput : bit(20) ,

    /**
     *
     */

    ExtendedProcessing : bit(21)
}
