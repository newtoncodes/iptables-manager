'use strict';

const getProto = (str) => {
    str = (str || '').toString().trim().toLowerCase();
    if (!str || str === 'any') return null;
    if (str !== 'tcp' && str !== 'udp') return false;
    
    return str;
};

let tpl = async (ask) => {
    let proto = false;
    while (proto === false) proto = getProto(await ask('Protocol [options: tcp, udp, any; default: any]: '));
    
    return `
# Allow all input

iptables -A INPUT ${proto ? ` -p ${proto}` : ''} -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT${proto ? ` -p ${proto}` : ''} -m state --state ESTABLISHED     -j ACCEPT
`;
};


module.exports = tpl;