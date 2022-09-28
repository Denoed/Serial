
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

    EnableSignals            : bit(0) ,

    Canonical                : bit(1) ,

    /**
     *  Echo input
     */

    Echo : bit(5) ,

    /**
     *  If Canonical is set:
     *  Preceding char is erased with ERASE
     *  Preceding word is erased with WERASE
     */

    EchoErase : bit(6) ,

    /**
     *  If Canonical is set:
     *  Current line is erased with KILL
     */

    EchoKill : bit(7) ,

    /**
     *  If Canonical is set:
     *  Echos newline chars
     */

    EchoNewline : bit(8) ,
}
