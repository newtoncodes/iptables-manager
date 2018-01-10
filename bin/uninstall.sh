#!/bin/bash

res=$(which chkconfig)

set -e

if [ "$res" != "" ]; then
    sudo chkconfig --del iptables-manager
else
    sudo update-rc.d -f iptables-manager remove
fi