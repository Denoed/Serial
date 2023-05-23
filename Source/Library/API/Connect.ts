
export { connect }

import { exclusive , openPort , flushIO } from '../Native.js'
import { FileDescriptor } from '../Types/mod.ts'
import { BaudRate } from '../Helper/BaudRate.ts'

import SerialPort from '../SerialPort.js'
import Settings from '../Settings.js'


async function connect ( options = {} ){

    if( ! ( 'path' in options ) )
        throw `Cannot connect to a serial port without a PATH to it.`

    const { path } = options;

    const file = await
        openPort(path)

    await exclusive(file)

    const backup = await 
        Settings.of(file)

    await setDefaults(file)
    await flushIO(file)

    return new SerialPort(file,backup)
}


async function setDefaults ( file : FileDescriptor ){

    const settings = await 
        Settings.of(file)

    settings.all.modemLine = {}

    settings.flags.input.IgnoreBreaks = true;
    settings.flags.output = {}
    settings.flags.local = {}


    const { control } = settings.flags;

    control.Local = true;
    control.Read = true;

    await settings.writeTo(file);

    const port = new SerialPort(file);
    await port.setBaudRate(BaudRate.B9600);
    await port.setCharSize(8);
    await port.setFlowControl(null);
    await port.setParity(null);
    await port.useDoubleStopBits(false);
    await port.setVMin(1);
    await port.setVTime(0);
}
