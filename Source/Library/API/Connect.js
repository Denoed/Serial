
import {
    flushIO , openPort , closeFile ,
    exclusive , deviceCall , queryTerminalSettings
} from '../Native.js'

import SerialPort from '../SerialPort.js'
import Settings from '../Settings.js'

const { log } = console;


export default async function connect ( options = {} ){

    if(! 'path' in options)
        throw `Cannot connect to a serial port without a PATH to it.`

    log('Options',options,options.path);

    const file = await openPort(options.path);

    log('FD',file);

    let backup;

    // try {

    await exclusive(file);

    backup = await Settings.of(file);
    log('Original control',backup.controlFlags);
    backup.log();

    await setDefaults(file);
    await flushIO(file);

    // } catch (error) {
    //     console.error(error);
    // }


    return new SerialPort(file);
}


import InputFlag from '../Enums/InputFlag.js'
import ControlFlag from '../Enums/ControlFlag.js'


async function setDefaults ( file ){

    const settings = await Settings.of(file);
    settings.log();
    settings.line = 0x0;
    settings.inputFlags = InputFlag.IgnoreBreaks;
    settings.outputFlags = 0;
    settings.localFlags = 0;

    let { controlFlags } = settings;

    controlFlags |= ControlFlag.Read
                 |  ControlFlag.Local ;

    log('controlflag',controlFlags)

    settings.controlFlags = controlFlags;

    await settings.writeTo(file);

    const port = new SerialPort(file);
    await port.setBaudRate(115200);
    await port.setCharSize(8);
    await port.setFlowControl(null);
    await port.setParity(null);
    await port.useDoubleStopBits(false);
    await port.setVMin(1);
    await port.setVTime(0);
}
