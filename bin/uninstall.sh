#!/usr/bin/env bash

set -e

res=$(which chkconfig)
if [ "$res" != "" ]; then
    sudo chkconfig --del iptables-manager
else
    sudo update-rc.d -f iptables-manager remove
fi