
import { mask as bit } from '../Misc/Bits.ts'


export default {

    /**
     *  2 bit character size : 5 - 8 bits
     */

    CharacterSize : bit(4)
                  | bit(5) ,

    /**
     *  Baudrate
     */

    Baudrate : bit(0)
             | bit(1)
             | bit(2)
             | bit(3)
             | bit(12)

}
