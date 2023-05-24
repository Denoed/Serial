#!/usr/bin/env bash

clear

deno run            \
    --watch         \
    --unstable      \
    --allow-read    \
    --allow-ffi     \
    --allow-write   \
    Tests/Run.ts
