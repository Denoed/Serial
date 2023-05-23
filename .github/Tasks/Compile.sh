#!/usr/bin/env bash

clear

folder_repository="$(dirname -- $(readlink -fn -- "$0"; echo x))/../.."
folder_library="${folder_repository}/Source/Library"
folder_native="${folder_repository}/Source/Native"
folder_build="${folder_repository}/Build"

rm -r $folder_build
mkdir $folder_build


g++                             \
    -I/usr/include/libserial    \
    -o $folder_build/Serial.o   \
    -fmodules-ts                \
    -std=c++20                  \
    -fPIC                       \
    -c                          \
    $folder_native/Serial.cpp

g++                             \
    $folder_build/Serial.o      \
    -o $folder_library/Serial.so  \
    -shared                     \
    -W                          \
    -lserial
