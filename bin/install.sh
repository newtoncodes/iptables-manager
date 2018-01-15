#!/bin/bash

echo "Installing..."

set -e

dir=$(dirname "$0")

sudo cp -f ${dir}/init.sh /etc/init.d/iptables-manager
sudo chmod +x /etc/init.d/iptables-manager
sudo mkdir -p /etc/iptables-manager

set +e

res=$(which chkconfig)

set -e

if [ "$res" != "" ]; then
    sudo chkconfig --add iptables-manager
    sudo chkconfig --level 2345 iptables-manager on
else
    sudo update-rc.d iptables-manager defaults
fi

if [ ! -d /etc/iptables-manager ]; then
    sudo mkdir -p /etc/iptables-manager
fi

if [ -f /etc/iptables-manager/vars.env ]; then
    echo "Configs already exist."
    exit 0;
fi

sudo echo "
POLICY_INPUT=DROP
POLICY_OUTPUT=DROP
POLICY_FORWARD=DROP

LOG_SPAM=1
" > /etc/iptables-manager/vars.env

sudo mkdir -p /etc/iptables-manager/rules

sudo echo "#!/bin/bash

# Allow all traffic
# REMOVE THIS RULE FILE WHEN YOU'RE DONE SETTING UP IPTABLES MANAGER.

iptables -A INPUT  -j ACCEPT
iptables -A OUTPUT -j ACCEPT
" > /etc/iptables-manager/rules/all-default

sudo echo "#!/bin/bash

# Allow all outgoing traffic

iptables -A OUTPUT -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A INPUT  -m state --state ESTABLISHED     -j ACCEPT
" > /etc/iptables-manager/rules/output-all


echo "All done."