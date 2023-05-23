
#include <Arduino.h>


const auto BaudRate = 115200UL;


void setup(){
    Serial.begin(BaudRate);
}

void loop(){
    Serial.println("Ping");
    delay(1000);
}
