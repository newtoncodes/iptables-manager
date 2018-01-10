#!/usr/bin/env bash

set -e

dir=$(dirname "$0")

sudo cp -f ${dir}/init.sh /etc/init.d/iptables-manager
sudo chmod +x /etc/init.d/iptables-manager
sudo mkdir -p /etc/iptables-manager

res=$(which chkconfig)
if [ "$res" != "" ]; then
    sudo chkconfig --add myscript
    sudo chkconfig --level 2345 myscript on
else
    sudo update-rc.d iptables-manager defaults
fi

if [ ! -d /etc/iptables-manager ]; then
    sudo mkdir -p /etc/iptables-manager
fi

if [ -f /etc/iptables-manager/vars.env ]; then
    exit 0;
fi

sudo echo "
POLICY_INPUT=DROP
POLICY_OUTPUT=DROP
POLICY_FORWARD=DROP

LOG_SPAM=1
" > /etc/iptables-manager/vars.env

sudo mkdir -p /etc/iptables-manager/rules