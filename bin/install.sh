#!/usr/bin/env bash

set -e

dir=$(dirname "$0")

PATH_CONFIG=/etc/iptables-manager

sudo cp -f ${dir}/init.sh /etc/init.d/iptables-manager
sudo chmod +x /etc/init.d/iptables-manager

res=$(which chkconfig)
if [ "$res" != "" ]; then
    sudo chkconfig --add myscript
    sudo chkconfig --level 2345 myscript on
else
    sudo update-rc.d iptables-manager defaults
fi

if [ ! -d ${PATH_CONFIG} ]; then
    sudo mkdir -p ${PATH_CONFIG}
fi

if [ -f ${PATH_CONFIG}/vars.env ]; then
    exit 0;
fi

sudo echo "
POLICY_INPUT=DROP
POLICY_OUTPUT=DROP
POLICY_FORWARD=DROP

LOG_SPAM=1
" > ${PATH_CONFIG}/vars.env

sudo mkdir -p ${PATH_CONFIG}/rules