'use strict';

const exists = require('fs').existsSync;
const unlink = require('fs').unlinkSync;


module.exports = (rule) => {
    if (!exists('/etc/iptables-manager/rules/' + rule)) {
        console.error(`Rule ${rule} does not exist.`);
        process.exit(1);
    }
    
    unlink('/etc/iptables-manager/rules/' + rule);
    console.log('Rule deleted.\nThis does not immediately take effect. You have to reload in order to remove a rule.');
};
