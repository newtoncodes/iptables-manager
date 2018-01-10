'use strict';

const exec = require('child_process').execSync;
const exists = require('fs').existsSync;


module.exports = (rule) => {
    if (!rule) {
        try {
            exec(`bash ${__dirname + '/../bin/iptables-rules.sh'}`, {stdio: 'inherit'});
        } catch (e) {
            console.log('');
            process.exit(1);
        }
    
        return;
    }
    
    if (!exists('/etc/iptables-manager/rules/' + rule)) {
        console.error(`Rule ${rule} does not exist.`);
        process.exit(1);
    }
    
    exec(`bash ${'/etc/iptables-manager/rules/' + rule}`, {stdio: 'inherit'});
};
