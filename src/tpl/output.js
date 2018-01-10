'use strict';

const getIp = (str) => {
    str = (str || '').toString().trim();
    if (!str) return null;
    
    let m = str.match(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    if (!m) return false;
    
    return str;
}

const getPort = (str) => {
    str = (str || '').toString().trim();
    
    if (!str) return false;
    
    if (str.indexOf(',') !== -1) {
        let m = str.match(/^([123456789]\d*)\s*(\s*,\s*([123456789]\d*))+$/);
        if (!m) return false;
        
        let ports = str.split(',').map(s => parseInt(s.trim()));
        
        for (let p of ports) {
            if (isNaN(p) || p < 1 || p > 65535) {
                return false;
            }
        }
        
        return ports;
    }
    
    let m = str.match(/^([123456789]\d*)(:([123456789]\d*))?$/);
    if (!m) return false;
    
    let left = parseInt(m[1]);
    let right = m[2] ? parseInt(m[3]) : null;
    
    if (isNaN(left) || (right !== null && isNaN(right))) return false;
    
    if (right !== null) {
        if (left === right) right = null;
        else if (left > right) return false;
    }
    
    if (left > 65535 || (right !== null && right > 65535)) return false;
    
    return [`${left}${right !== null ? `:${right}` : ''}`];
}

const getIface = (str) => {
    str = (str || '').toString().trim().toLowerCase();
    if (!str) return null;
    if (!str.match(/^[a-z0-9]+$/)) return false;
    
    return str;
}

const getProto = (str) => {
    str = (str || '').toString().trim().toLowerCase();
    if (!str || str === 'any') return null;
    if (str !== 'tcp' && str !== 'udp') return false;
    
    return str;
}

let tplOne = async (ask) => {
    let ports = null;
    while (!ports) ports = getPort(await ask('Port [format: 1024; 1024,4048,8096; 1024:65535]: '));
    
    let proto = false;
    while (proto === false) proto = getProto(await ask('Protocol [options: tcp, udp, any; default: any]: '));
    
    let i = false;
    while (i === false) i = getIface(await ask('Network interface - eth0/tun0/etc... (used instead of source ip) [default: any]: '));
    
    let s = false;
    while (s === false) s = getIp(await ask('Source IP - the server address (used instead of network interface) [default: any]: '));
    
    let d = false;
    while (d === false) d = getIp(await ask('Destination IP - the external address [default: any]: '));
    
    let rule = '# Custom rules\n';
    for (let port of ports) {
        rule += `
iptables -A OUTPUT --dport ${port}${proto ? ` -p ${proto}` : ''}${i ? ` -i ${i}` : ''}${s ? ` -s ${s}` : ''}${d ? ` -d ${d}` : ''} -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A INPUT  --sport ${port}${proto ? ` -p ${proto}` : ''}${i ? ` -i ${i}` : ''}${s ? ` -d ${s}` : ''}${d ? ` -s ${d}` : ''} -m state --state ESTABLISHED     -j ACCEPT
`;
    }
    
    return rule;
}

let tpl = async (ask) => {
    let rule = await tplOne(ask);
    
    console.log('');
    let a = await ask('Do you want to add another rule? [options: yes, no; default: no]: ');
    a = (a || '').toString().trim().toLowerCase();
    
    while (a === 'yes') {
        rule += await tplOne(ask);
        
        console.log('');
        a = await ask('Do you want to add another rule? [options: yes, no; default: no]: ');
        a = (a || '').toString().trim().toLowerCase();
    }
    
    return rule;
}


module.exports = tpl;