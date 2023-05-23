
export { connect }

import {
    flushIO , openPort , closeFile ,
    exclusive , deviceCall , queryTerminalSettings
} from '../Native.js'

import SerialPort from '../SerialPort.js'
import Settings from '../Settings.js'
import { BaudRate } from '../Helper/BaudRate.ts'

const { log } = console;


async function connect ( options = {} ){

    if( ! ( 'path' in options ) )
        throw `Cannot connect to a serial port without a PATH to it.`

    const { path } = options;

    const file = await
        openPort(path)

    let backup;

    await exclusive(file);

    backup = await Settings.of(file);

    await setDefaults(file);
    await flushIO(file);

    return new SerialPort(file,backup);
}


import { InputFlag } from '../Enums/InputFlag.ts'
import ControlFlag from '../Enums/ControlFlag.js'


async function setDefaults ( file ){

    const settings = await Settings.of(file);

    settings.all.modemLine = {};

    settings.flags.input.IgnoreBreaks = true;
    settings.flags.output = {};
    settings.flags.local = {};


    const { control } = settings.flags;

    control.Read = true;
    control.Local = true;

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
