#!/usr/bin/env bash

PATH_CONFIG=$1

if [ ! -d ${PATH_CONFIG} ]; then
    echo "Directory $PATH_CONFIG does not exist."
    exit 1;
fi

if [ ! -d ${PATH_CONFIG}/rules ]; then
    exit 0;
fi

files=$(ls -A ${PATH_CONFIG}/rules)

if [ "$files" != "" ]; then
    for f in ${PATH_CONFIG}/rules/*
    do
        echo "Executing iptables config: $f"
        source ${f};
    done
fi
