'use strict';

const exec = require('child_process').execSync;

const PATH = __dirname + '/../config';


module.exports = () => {
    try {
        exec(`bash ${__dirname + '/../bin/iptables.sh'} "${PATH}"`, {stdio: 'inherit'});
    } catch (e) {
        console.log('');
        process.exit(1);
    }
};
