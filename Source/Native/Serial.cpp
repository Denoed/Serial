#include "Serial.hpp"

#include <sys/ioctl.h>
#include <termios.h>
#include <unistd.h>
#include <fcntl.h>
#include <string>
#include <string.h>



extern "C" {

    int deviceCall ( File address , IOCommand command , uint8_t * parameter ){
        return ioctl( address , command , parameter );
    }

    int modifyFile ( File address , int command , uint8_t * parameter){
        return fcntl(address,command,parameter);
    }


    int readBytes ( File address , uint8_t * buffer , size_t byteCount ){
        return read( address , buffer , byteCount );
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

    int queryTerminalSettings ( File address , termios * data ){
        return tcgetattr( address , data );
    }

    int updateTerminalSettings ( File address , termios * data ){
        return tcsetattr( address , TCSANOW , data );
    }

    int Terminal_drainBuffer ( File address ){
        return tcdrain( address );
    }



    int Terminal_flush ( File address , uint8_t type ){
        return tcflush( address , TCIOFLUSH );
    }



    void Termios_setLine ( termios * settings , unsigned char line ){
        settings -> c_line = line;
    }

    void Termios_setVTime ( termios * settings , int16_t time ){
        settings -> c_cc[5] = time;
    }

    void Termios_setVMin ( termios * settings , int16_t min ){
        settings -> c_cc[6] = min;
    }

    void Termios_setInputFlags ( termios * settings , uint32_t flags ){
        settings -> c_iflag = flags;
    }

    void Termios_setOutputFlags ( termios * settings , uint32_t flags ){
        settings -> c_oflag = flags;
    }

    void Termios_setControlFlags ( termios * settings , uint32_t flags ){
        settings -> c_cflag = flags;
    }

    void Termios_setLocalFlags ( termios * settings , uint32_t flags ){
        settings -> c_lflag = flags;
    }

    void Termios_setSpeed ( termios * settings , uint32_t speed ){
        // cfsetspeed(settings,speed);
        settings -> c_ospeed = speed;
        settings -> c_ispeed = speed;
    }



    int16_t Termios_getVTime ( termios * settings ){
        return settings -> c_cc[5];
    }

    int16_t Termios_getVMin ( termios * settings ){
        return settings -> c_cc[6];
    }

    uint32_t Termios_getControlFlags ( termios * settings ){
        return settings -> c_cflag;
    }

    uint32_t Termios_getInputFlags ( termios * settings ){
        return settings -> c_iflag;
    }

    uint32_t Termios_getOutputFlags ( termios * settings ){
        return settings -> c_oflag;
    }

    uint8_t Termios_getControlChar ( termios * settings , uint8_t type ){
        return settings -> c_cc[type];
    }

    uint32_t Termios_getInputSpeed ( termios * settings ){
        return settings -> c_ispeed;
    }

    uint32_t Termios_getOutputSpeed ( termios * settings ){
        return settings -> c_ospeed;
    }

    uint32_t Termios_getLocalFlags ( termios * settings ){
        return settings -> c_lflag;
    }

    unsigned char Termios_getLine ( termios * settings ){
        return settings -> c_line;
    }
}
