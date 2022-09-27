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

    int Terminal_flushInput ( File address ){
        return tcflush( address , TCIFLUSH );
    }

    int Terminal_flushOutput ( File address ){
        return tcflush( address , TCOFLUSH );
    }

    int Terminal_flush ( File address ){
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


    termios * Termios (
        tcflag_t inputMode ,
        tcflag_t outputMode ,
        tcflag_t controlMode ,
        tcflag_t localMode ,
        cc_t lineDiscipline ,
        cc_t * controlCharacters ,
        speed_t inputSpeed ,
        speed_t outputSpeed
    ){
        const auto settings = new termios {};
        settings -> c_iflag = inputMode;
        settings -> c_oflag = outputMode;
        settings -> c_cflag = controlMode;
        settings -> c_lflag = localMode;
        settings -> c_line = lineDiscipline;
        * settings -> c_cc = * controlCharacters;
        settings -> c_ispeed = inputSpeed;
        settings -> c_ospeed = outputSpeed;

        return settings;
    }




}
