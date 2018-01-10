'use strict';

const exists = require('fs').existsSync;
const unlink = require('fs').unlinkSync;

const PATH = __dirname + '/../config';


module.exports = (rule) => {
    if (!exists(PATH + '/rules/' + rule)) {
        console.error(`Rule ${rule} does not exist.`);
        process.exit(1);
    }
    
    unlink(PATH + '/rules/' + rule);
    console.log('Rule deleted.\nThis does not immediately take effect. You have to reload in order to remove a rule.');
};
