#!/usr/bin/env -S deno run --allow-read --allow-ffi --allow-write --unstable


import { availablePorts } from '../Source/Library/mod.ts'

const { clear , log } = console;


clear();

for(let i = 0;i < 10;i++)
    log('')


const ports = await availablePorts();

log('Ports',ports);
