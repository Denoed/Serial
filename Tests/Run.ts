
import * as Serial from '../Source/Library/mod.ts'

const { clear , log } = console;


clear();

console.log(Array(20).fill('').join('\n'))


const ports = Serial
    .availablePorts()

for await ( const port of ports )
    console.log('Port',port)



const port = await Serial.connect({
    flowControl : null ,
    baudRate : Serial.BaudRate.B115200 ,
    charSize : 8 ,
    stopBits : 1 ,
    parity : null ,
    path : '/dev/ttyUSB0'
})


log(`Connected to Arduino`)


try {

    await port.printSettings();

    await port.flushInput();

    let tries = 0;

    let count = 0;


    await new Promise((resolve) => {
        const i = setInterval(async () => {

            tries++;

            const amount = await port
                .available();



            if( count != amount ){
                count = amount;
                tries = 0;
            }

            if( count > 10 || tries > 1000 ){
                clearInterval(i);
                resolve(true);
            }

        },10);
    });

    if( count ){

        log('Count',count)

        const buffer = await port
            .readBytes(count)

        log('Buffer',buffer);

        const decoder = new TextDecoder

        const text = decoder
            .decode(buffer)

        log(`Text : '${ text }'`);
    }

} catch ( error ){

    console.error(error,error.stack)

} finally {

    log('Closing Port ..')

    await port
        .close()

    log('Closed Port.')
}
