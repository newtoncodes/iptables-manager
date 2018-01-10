'use strict';

const getIp = (str) => {
    str = (str || '').toString().trim();
    if (!str) return null;
    
    let m = str.match(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    if (!m) return false;
    
    return str;
};

const getIface = (str) => {
    str = (str || '').toString().trim().toLowerCase();
    if (!str) return null;
    if (!str.match(/^[a-z0-9]+$/)) return false;
    
    return str;
};


let tpl = async (ask) => {
    let https = await ask('Include HTTPS [options: yes, no; default: yes]: ');
    https = (https || '').toString().trim().toLowerCase();
    https = (!https || https === 'yes');
    
    let i = false;
    while (i === false) i = getIface(await ask('Network interface - eth0/tun0/etc... (used instead of destination ip) [default: any]: '));
    
    let d = false;
    while (d === false) d = getIp(await ask('Destination IP - the server address (used instead of network interface) [default: any]: '));
    
    let rule = `
# HTTP server

## HTTP
iptables -A INPUT  --dport 80 -p tcp${i ? ` -i ${i}` : ''}${d ? ` -d ${d}` : ''} -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT --sport 80 -p tcp${i ? ` -i ${i}` : ''}${d ? ` -s ${d}` : ''} -m state --state ESTABLISHED     -j ACCEPT
`;
    
    if (https) rule += `
## HTTPS
iptables -A INPUT  --dport 443 -p tcp${i ? ` -i ${i}` : ''}${d ? ` -d ${d}` : ''} -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT --sport 443 -p tcp${i ? ` -i ${i}` : ''}${d ? ` -s ${d}` : ''} -m state --state ESTABLISHED     -j ACCEPT
`;
    
    return rule;
};


module.exports = tpl;