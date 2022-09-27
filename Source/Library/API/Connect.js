
import {
    flushIO , availableBytes , openPort , closeFile ,
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

    try {

        await exclusive(file);

        backup = await Settings.of(file);
        log('Original control',backup.controlFlags);
        backup.log();

        await setDefaults(file);
        await flushIO(file);

    } catch (error) {
        console.error(error);
    }




    return {
        close : async () => {

            try {

                log('Closing',backup,file);

                log('control2',backup.controlFlags);

                if(backup && file > 0)
                    await backup.writeTo(file);

            } catch ( error ){
                console.error('Failed to restore port settings',error);
            } finally {
                closeFile(file);
            }
        }
    }
}


import InputFlag from '../InputFlag.js'
import ControlFlag from '../ControlFlag.js'


async function setDefaults ( file ){

    const settings = await Settings.of(file);
    settings.log();
    settings.line = 0x0;
    settings.inputFlags = InputFlag.IgnoreBreaks;
    settings.outputFlags = 0;
    settings.localFlags = 0;

    let { controlFlags } = settings;
    log('Before Control',controlFlags);

    controlFlags |= ControlFlag.Read
                 |  ControlFlag.Local ;

    log('After Control',controlFlags);

    settings.controlFlags = controlFlags;

    log('control0',settings.controlFlags);


    await settings.writeTo(file);

    log('control1',settings.controlFlags);

    {
        const settings = await Settings.of(file);
        log('control0000',settings.controlFlags);
    }

    log('Def',file);

    const port = new SerialPort(file);
    await port.setBaudRate(115200);
    await port.setCharSize(48);
    await port.setFlowControl(null);
    await port.setParity(null);
    await port.setStopBits(1);
    await port.setVMin(1);
    await port.setVTime(0);
}



async function isDataAvailable ( file ){
    const count = await availableBytes(file);
    log('Count',count);
    return count > 0;
}
