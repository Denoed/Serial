
const method = (parameters,result,isAsync = false) =>
    ({ nonblocking : isAsync , parameters , result });


const termios_set = (type) =>
    method([ 'pointer' , type ],'void');

const termios_get = (type) =>
    method([ 'pointer' ],type);



export default {

    readBytes : {
        nonblocking : true ,
        parameters : [ 'i32' , 'buffer' , 'u32' ] ,
        result : 'i32'
    },

    openPort : {
        nonblocking : true ,
        parameters : [ 'buffer' ] ,
        result : 'i32'
    },

    closePort : {
        nonblocking : false ,
        parameters : [ 'i32' ] ,
        result : 'i32'
    },

    error : {
        nonblocking : false ,
        parameters : [] ,
        result : 'i32'
    },

    deviceCall : {
        nonblocking : true ,
        parameters : [ 'i32' , 'u64' , 'buffer' ] ,
        result : 'i32'
    },

    queryTerminalSettings : {
        nonblocking : true ,
        parameters : [ 'i32' , 'pointer' ] ,
        result : 'i32'
    },

    updateTerminalSettings : {
        nonblocking : true ,
        parameters : [ 'i32' , 'pointer' ] ,
        result : 'i32'
    },

    Terminal_flush : {
        nonblocking : true ,
        parameters : [ 'i32' , 'u8' ] ,
        result : 'i32'
    },

    Termios_setLine : {
        nonblocking : false ,
        parameters : [ 'pointer' , 'u8' ] ,
        result : 'void'
    },

    Termios_getLine : {
        nonblocking : false ,
        parameters : [ 'pointer' ] ,
        result : 'u8'
    },

    modifyFile : {
        nonblocking : true ,
        parameters : [ 'i32' , 'i32' , 'buffer' ] ,
        result : 'i32'
    },


    Termios_getControlFlags : termios_get('u32') ,
    Termios_getOutputFlags : termios_get('u32') ,
    Termios_getInputFlags : termios_get('u32') ,
    Termios_getLocalFlags : termios_get('u32') ,

    Termios_getOutputSpeed : termios_get('u32') ,
    Termios_getInputSpeed : termios_get('u32') ,
    Termios_getVTime : termios_get('i16') ,
    Termios_getVMin : termios_get('i16') ,


    Termios_setControlFlags : termios_set('u32') ,
    Termios_setOutputFlags : termios_set('u32') ,
    Termios_setInputFlags : termios_set('u32') ,
    Termios_setLocalFlags : termios_set('u32') ,

    Termios_setSpeed : termios_set('u32') ,
    Termios_setVTime : termios_set('i16') ,
    Termios_setVMin : termios_set('i16') ,


    Termios_getControlChar : {
        nonblocking : false ,
        parameters : [ 'pointer' , 'u8' ] ,
        result : 'u8'
    }
}
