'use strict';

const exec = require('child_process').execSync;


module.exports = () => {
    try {
        exec(`bash ${__dirname + '/../bin/iptables.sh'}`, {stdio: 'inherit'});
    } catch (e) {
        console.log('');
        process.exit(1);
    }
};
