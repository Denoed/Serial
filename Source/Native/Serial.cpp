#include "Serial.hpp"

#include <string>
#include <cstring>

#include <sys/ioctl.h>
#include <fcntl.h>
#include <unistd.h>

#include <cerrno>


extern "C" {

    auto deviceCall ( File address , IOCommand command , uint8_t * parameter ) -> int {
        return ioctl( address , command , parameter );
    }


    auto exception () -> int {
        return errno;
    }

    auto openSerialPort ( const char * path , uint8_t * error ) -> int {
        auto result = open(path,O_RDWR | O_NOCTTY | O_NONBLOCK);
        memcpy(error,& errno,sizeof(int));
        return result;
    }

    auto closeSerialPort ( int fileDesciptor , uint8_t * error ) -> int {
        auto result = close(fileDesciptor);
        memcpy(error,& errno,sizeof(int));
        return result;
    }

    auto serialInfo ( File address , uint8_t * info , uint8_t * error ) -> int {

        uint8_t data [72];

        if(ioctl(address,TIOCGSERIAL,& data) == -1){
            memcpy(error,& errno,sizeof(int));
            return -1;
        }

        memcpy(info,& data,sizeof(data));

        return true;
    }
}
