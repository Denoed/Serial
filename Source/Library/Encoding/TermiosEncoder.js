

import { InputFlag } from '../Enums/InputFlag.ts'
import OutputFlag from '../Enums/OutputFlag.js'
import ControlFlag from '../Enums/ControlFlag.js'
import LocalFlag from '../Enums/LocalFlag.js'
import OutputDelayMask from '../Enums/OutputDelayMask.js'
import ControlCharacter from '../Enums/ControlCharacter.js'
import ControlMask from '../Enums/ControlMask.js'
import ModemLine from '../Enums/ModemLine.js'


const { debug } = console;


const baudrateMapping = [
    [ 4000000 , 4111 ] ,
    [ 3500000 , 4110 ] ,
    [ 3000000 , 4109 ] ,
    [ 2500000 , 4108 ] ,
    [ 2000000 , 4107 ] ,
    [ 1500000 , 4106 ] ,
    [ 1152000 , 4105 ] ,
    [ 1000000 , 4104 ] ,
    [  921600 , 4103 ] ,
    [  576000 , 4102 ] ,
    [  500000 , 4101 ] ,
    [  460800 , 4100 ] ,
    [  230400 , 4099 ] ,
    [  115200 , 4098 ] ,
    [   57600 , 4097 ] ,
    [   38400 , 15   ] ,
    [   19200 , 14   ] ,
    [    9600 , 13   ] ,
    [    4800 , 12   ] ,
    [    2400 , 11   ] ,
    [    1800 , 10   ] ,
    [    1200 , 9    ] ,
    [     600 , 8    ] ,
    [     300 , 7    ] ,
    [     200 , 6    ] ,
    [     150 , 5    ] ,
    [     134 , 4    ] ,
    [     110 , 3    ] ,
    [      75 , 2    ] ,
    [      50 , 1    ]
]

const bitrateToType = Object.fromEntries(baudrateMapping);


function u32ToBytes ( number ){
    return [
        ( number >>  0 ) & 255 ,
        ( number >>  8 ) & 255 ,
        ( number >> 16 ) & 255 ,
        ( number >> 24 ) & 255
    ]
}


function fromFlags ( data , enums ){

    let flag = 0;

    for(const key in enums)
        if(data[key])
            flag |= enums[key];

    return flag;
}



export default function encode ( data ){

    const inputSpeed = u32ToBytes(bitrateToType[data.speed.input]);
    const outputSpeed = u32ToBytes(bitrateToType[data.speed.output]);

    const modemLine = fromFlags(data.modemLine,ModemLine);

    const f = Object.fromEntries(Object
        .entries(InputFlag)
        .filter(([ key ]) => Number.isNaN(parseInt(key))))

    const inputFlags = u32ToBytes(fromFlags(data.flags.input,f));
    const localFlags = u32ToBytes(fromFlags(data.flags.local,LocalFlag));
    let outputFlags = fromFlags(data.flags.output,OutputFlag);
    let controlFlags = fromFlags(data.flags.control,ControlFlag);

    debug('Control Flags',controlFlags);

    let charSize = data.characterSize - 5;

    debug('Char Size',charSize << 4);

    controlFlags |= ( charSize << 4 );

    const delays = data.delays;

    for(const mask in OutputDelayMask){

        const value = delays[mask];

        const [ a , b ] = OutputDelayMask[mask];


        outputFlags |= ((value & 1) << a)

        if(b)
            outputFlags |= (((value & 2) >> 1) << b)
    }


    let speed = bitrateToType[data.speed.input];

    if(speed > 15){
        controlFlags |= ( 1 << 12 );
        speed -= 4097;
    }

    controlFlags |= ( speed & 0b1111 );

    outputFlags = u32ToBytes(outputFlags);
    controlFlags = u32ToBytes(controlFlags);


    const controlCharacters = new Uint8Array(32);

    for(const char in ControlCharacter)
        // if(data.controlCharacters[char])
            controlCharacters[ControlCharacter[char]] = data.controlCharacters[char];

    return new Uint8Array([
        ... inputFlags ,
        ... outputFlags ,
        ... controlFlags ,
        ... localFlags ,
        ... inputSpeed ,
        ... outputSpeed ,
        modemLine ,
        ... controlCharacters
    ]);
}
