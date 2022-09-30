
import { InputFlag } from '../Enums/InputFlag.ts'
import OutputFlag from '../Enums/OutputFlag.js'
import ControlFlag from '../Enums/ControlFlag.js'
import LocalFlag from '../Enums/LocalFlag.js'
import OutputDelayMask from '../Enums/OutputDelayMask.js'
import ControlCharacter from '../Enums/ControlCharacter.js'
import ControlMask from '../Enums/ControlMask.js'
import ModemLine from '../Enums/ModemLine.js'

const { log } = console;


function u32 ( bytes ){
    return bytes[0] <<  0
         | bytes[1] <<  8
         | bytes[2] << 16
         | bytes[3] << 24 ;
}


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

const typeToBitrate = Object.fromEntries(baudrateMapping.map(([ a , b ]) => [ b , a ]));



export default function decode ( bytes ){

    log('Bytes',bytes);

    const inputFlags = u32(bytes.slice(0,4));

    const input = {};

    log(InputFlag);

    for(const flag in InputFlag)
        if(!Number.isNaN(parseInt(flag)))
            input[InputFlag[flag]] = (inputFlags & flag) > 0;

    const output = {};

    const outputFlags = u32(bytes.slice(4,8));

    for(const flag in OutputFlag)
        // if(!Number.isNaN(parseInt(flag)))
            output[flag] = (outputFlags & OutputFlag[flag]) > 0;


    const control = {};

    const controlFlags = u32(bytes.slice(8,12));

    for(const flag in ControlFlag)
            control[flag] = (controlFlags & ControlFlag[flag]) > 0;


    const local = {};

    const localFlags = u32(bytes.slice(12,16));

    for(const flag in LocalFlag)
            local[flag] = (localFlags & LocalFlag[flag]) > 0;


    const modemLine = {};

    const modem = bytes.slice(24,25);

    for(const line in ModemLine)
            modemLine[line] = (modem & ModemLine[line]) > 0;


    const controlCharacters = {};

    const characters = bytes.slice(25,57);

    for(const char in ControlCharacter)
        controlCharacters[char] = characters[ControlCharacter[char]];


    const
        inputSpeed = typeToBitrate[u32(bytes.slice(16,20))] ,
        outputSpeed = typeToBitrate[u32(bytes.slice(20,24))] ;


    const delays = {}

    for(const mask in OutputDelayMask){

        const [ a , b ] = OutputDelayMask[mask];

        let value = (outputFlags & ( 1 << a )) >> a;

        if(b)
            value |= (outputFlags & ( 1 << b )) >> ( b - 1 );

        delays[mask] = value;
    }


    const characterSize = ((controlFlags & ControlMask.CharacterSize) >> 4 ) + 5;


    return {
        flags : { input , output , control , local } ,
        speed : {
            input  : inputSpeed ,
            output : outputSpeed
        },
        delays ,
        modemLine ,
        controlCharacters ,
        characterSize
    }
}
