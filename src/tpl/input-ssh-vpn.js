'use strict';

const getIp = (str) => {
    str = (str || '').toString().trim();
    if (!str) return null;
    
    let m = str.match(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    if (!m) return false;
    
    return str;
}

const getIface = (str) => {
    str = (str || '').toString().trim().toLowerCase();
    if (!str) return 'eth0';
    if (!str.match(/^[a-z0-9]+$/)) return false;
    
    return str;
}

let tpl = async (ask) => {
    let i = false;
    while (i === false) i = getIface(await ask('Public network interface - eth0/wlan0/etc... [default: eth0]: '));
    
    let s = false;
    while (!s) s = getIp(await ask('Root IP - the public IPv4 address that will always have access to SSH, in case of VPN problems: '));
    
    let d = false;
    while (!d) d = getIp(await ask('VPN IP - the server\'s address within the VPN: '));
    
    return `
# Root IP
iptables -A INPUT  --dport 22 -p tcp -s ${s} -i ${i} -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT --sport 22 -p tcp -d ${s} -i ${i} -m state --state ESTABLISHED     -j ACCEPT

# VPN IP
iptables -A INPUT  --dport 22 -p tcp -d ${d} -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT --sport 22 -p tcp -s ${d} -m state --state ESTABLISHED     -j ACCEPT
`;
}


module.exports = tpl;