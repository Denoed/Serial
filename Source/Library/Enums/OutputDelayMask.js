
const bit = ( position ) =>
    1 << position;


export default {

    /**
     *  Newline delay mask.
     */

    Newline : [ 10 ] ,

    /**
     *  Carriege-Return delay mask.
     */

    CarriegeReturn : [ 12 , 13 ] ,

    /**
     *  Horizontal Tab delay mask.
     */

    HorizontalTab : [ 14 , 16 ] ,

    /**
     *  Backspace delay mask.
     */

    Backspace : [ 17 ] ,

    /**
     *  Vertical Tab delay mask.
     */

    VerticalTab : [ 18 ] ,

    /**
     *  Form feed delay mask.
     */

    FormFeed : [ 21 ]

}
