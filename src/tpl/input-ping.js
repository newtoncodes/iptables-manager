'use strict';


let tpl = async () => {
    return `
# PING requests

iptables -A INPUT  -p icmp --icmp-type 8 -s 0/0 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -p icmp --icmp-type 0 -d 0/0 -m state --state ESTABLISHED,RELATED     -j ACCEPT
`;
};


module.exports = tpl;