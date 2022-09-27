#!/usr/bin/env -S deno run --allow-read --allow-ffi --allow-write --unstable


import * as Serial from '../Source/Library/mod.ts'

const { clear , log } = console;


clear();

for(let i = 0;i < 10;i++)
    log('')


const port = await Serial.connect({
    flowControl : null ,
    baudRate : Serial.BaudRate.B115200 ,
    charSize : 8 ,
    stopBits : 1 ,
    parity : null ,
    path : '/dev/ttyUSB0'
})


await port.close();
