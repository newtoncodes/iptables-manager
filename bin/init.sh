#!/bin/bash

start() {
    touch /tmp/iptables-manager-running
    iptables-manager reload
}

stop() {
    echo "IPtables manager doesn't stop, because it doesn't really run anything."
    echo "It will just not execute the next system restart."

    rm -rf /tmp/iptables-manager-running
}

case "$1" in
    start)
       start
       ;;
    stop)
       stop
       ;;
    restart)
       stop
       start
       ;;
    status)
        if [ -f /tmp/iptables-manager-running ]; then
            echo "IPtables manager is enabled."
        else
            echo "IPtables manager is disabled."
        fi
       ;;
    *)
       echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0