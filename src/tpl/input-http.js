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
    while (i === false) i = getIface(await ask('Network interface - eth0/tun0/etc... (used only for input) [default: any]: '));
    
    let d = false;
    while (d === false) d = getIp(await ask('Destination IP - the server address (used both for input and output) [default: any]: '));
    
    let rule = `
# HTTP server

## HTTP
iptables -A INPUT  -p tcp${i ? ` -i ${i}` : ''}${d ? ` -d ${d}` : ''} --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp${d ? ` -s ${d}` : ''} --sport 80 -m state --state ESTABLISHED     -j ACCEPT
`;
    
    if (https) rule += `
## HTTPS
iptables -A INPUT  -p tcp${i ? ` -i ${i}` : ''}${d ? ` -d ${d}` : ''} --dport 443 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp${d ? ` -s ${d}` : ''} --sport 443 -m state --state ESTABLISHED     -j ACCEPT
`;
    
    return rule;
};


module.exports = tpl;