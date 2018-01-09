'use strict';

const exec = require('child_process').execSync;
const exists = require('fs').existsSync;

const PATH = __dirname + '/../config';


module.exports = (rule) => {
    if (!rule) {
        try {
            exec(`bash ${__dirname + '/../bin/iptables-rules.sh'} "${PATH}"`);
        } catch (e) {
            console.log('');
            process.exit(1);
        }
    
        return;
    }
    
    if (!exists(PATH + '/rules/' + rule)) {
        console.error(`Rule ${rule} does not exist.`);
        process.exit(1);
    }
    
    exec(`bash ${PATH + '/rules/' + rule} "${PATH}"`);
};
