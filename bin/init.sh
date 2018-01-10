#!/bin/bash
### BEGIN INIT INFO
# Provides:          iptables-manager
# Required-Start:    $local_fs $network
# Required-Stop:     $local_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: iptables-manager
# Description:       iptables-manager
### END INIT INFO

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