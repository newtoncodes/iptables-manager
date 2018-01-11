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
    iptables-manager reload
}

stop() {
    echo "IPtables manager doesn't stop, because it doesn't really run anything."
    echo "If you don't want to have iptables reload every boot, disable the service or uninstall iptables-manager."
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
        echo "IPtables manager is enabled."
       ;;
    *)
       echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0