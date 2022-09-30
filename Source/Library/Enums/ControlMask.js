
const bit = ( position ) =>
    1 << position;


export default {

    /**
     *  2 bit character size : 5 - 8 bits
     */

    CharacterSize  : bit(5) | bit(4) ,

    /**
     *  Baudrate
     */

    Baudrate : bit(12) | bit(3) | bit(2) | bit(1) | bit(0)

}
