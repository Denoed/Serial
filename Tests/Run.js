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

try {

    await port.printSettings();

    await port.flushInput();

    let tries = 0;

    let a = false;


    await new Promise((resolve) => {
        const i = setInterval(async () => {

            tries++;

            a = await port.isDataAvailable();

            if(a || tries > 200){
                clearInterval(i);
                resolve();
            }

        },10);
    });

    if(a){
        let buffer = await port.readBytes(12);
        log('Buffer',buffer);
        const decoder = new TextDecoder();
        const text = decoder.decode(buffer);
        log('Text',text);
    }

} catch ( error ){
    throw error;
} finally {

    log('Closed');

    await port.close();
}
