
export default {

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
    }
}
