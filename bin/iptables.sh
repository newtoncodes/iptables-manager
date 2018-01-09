#!/usr/bin/env bash

PATH_CONFIG=$1

echo "PATH_CONFIG $PATH_CONFIG"

if [ ! -d ${PATH_CONFIG} ]; then
    echo "Directory $PATH_CONFIG does not exist."
    exit 1;
fi

if [ -f ${PATH_CONFIG}/vars.env ]; then
    source ${PATH_CONFIG}/vars.env
fi

POLICY_INPUT=${POLICY_INPUT:-DROP}
POLICY_OUTPUT=${POLICY_OUTPUT:-DROP}
POLICY_FORWARD=${POLICY_FORWARD:-DROP}
LOG_SPAM=${LOG_SPAM:-1}

echo "POLICY_INPUT $POLICY_INPUT"
echo "POLICY_OUTPUT $POLICY_OUTPUT"
echo "POLICY_FORWARD $POLICY_FORWARD"
echo "LOG_SPAM $LOG_SPAM"

set -e

# Clear.
iptables -F
iptables -X

# Default drop all policy.
iptables -P INPUT ${POLICY_INPUT}
iptables -P OUTPUT ${POLICY_OUTPUT}
iptables -P FORWARD ${POLICY_FORWARD}

# All localhost.
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

if [ "$LOG_SPAM" = "1" ]; then
    # Log spam
    iptables -A INPUT -p udp -j LOG --log-prefix "UDP-SPAM " --log-ip-options -m limit --limit 1/m --limit-burst 1
    iptables -A INPUT -p tcp -j LOG --log-prefix "TCP-SPAM " --log-ip-options -m limit --limit 1/m --limit-burst 1
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
