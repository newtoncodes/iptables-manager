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
};
