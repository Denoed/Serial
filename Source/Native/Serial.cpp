#include "Serial.hpp"

#include <sys/ioctl.h>
#include <unistd.h>
#include <fcntl.h>
#include <string>


extern "C" {

    int deviceCall ( File address , IOCommand command , uint8_t * parameter ){
        return ioctl( address , command , parameter );
    }

    int error (){
        return errno;
    }

    int openPort ( Path address ){
        return open(address,O_RDWR | O_NOCTTY | O_NONBLOCK);
    }

    int closePort ( File address ){
        return close(address);
    }
}
