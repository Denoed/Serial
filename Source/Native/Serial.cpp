
#include <string>
#include <cstring>

#include <sys/ioctl.h>
#include <fcntl.h>
#include <unistd.h>


extern "C" {

    int openSerialPort ( const char * path , uint8_t * error ){
        auto result = open(path,O_RDWR | O_NOCTTY | O_NONBLOCK);
        memcpy(error,& errno,sizeof(int));
        return result;
    }

    int closeSerialPort ( int fileDesciptor , uint8_t * error ){
        auto result = close(fileDesciptor);
        memcpy(error,& errno,sizeof(int));
        return result;
    }

    int serialInfo ( int fileDescriptor , uint8_t * info , uint8_t * error ){

        uint8_t data [72];

        if(ioctl(fileDescriptor,TIOCGSERIAL,& data) == -1){
            memcpy(error,& errno,sizeof(int));
            return -1;
        }

        memcpy(info,& data,sizeof(data));

        return true;
    }
}
