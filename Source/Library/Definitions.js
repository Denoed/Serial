
export default {

    serialInfo : {
        nonblocking : true ,
        parameters : [ 'i32' , 'buffer' , 'buffer' ] ,
        result : 'i32'
    },

    openSerialPort : {
        nonblocking : true ,
        parameters : [ 'buffer' , 'buffer' ] ,
        result : 'i32'
    },

    closeSerialPort : {
        nonblocking : false ,
        parameters : [ 'i32' , 'buffer' ] ,
        result : 'i32'
    },

    exception : {
        nonblocking : false ,
        parameters : [] ,
        result : 'i32'
    }
}
