'use strict';

const read = require('read-input').stdin;
const mkdir = require('fs').mkdirSync;
const exists = require('fs').existsSync;
const readFile = require('fs').readFileSync;
const writeFile = require('fs').writeFileSync;
const readline = require('readline');
const rl = readline.rli || readline.createInterface({input: process.stdin, output: process.stdout});
readline.rli = rl;
const ask = require('util').promisify((q, c) => rl.question(q, a => c(null, a)));

const PATH = __dirname + '/../config';


const add = (rule, content) => {
    if (exists(PATH + '/rules/' + rule)) {
        console.error(`Rule ${rule} already exists.`);
        process.exit(1);
    }
    
    try {
        if (!exists(PATH + '/rules/')) mkdir(PATH + '/rules');
        writeFile(PATH + '/rules/' + rule, '#!/bin/bash\n\n' + content.trim() + '\n', 'utf8');
        
        console.log('\nRules written to file: ' + PATH + '/rules/' + rule);
    } catch (e) {
        console.error(`Could not write to file: ${PATH + '/rules/' + rule}`);
        process.exit(1);
    }
}

module.exports = {
    add: (rule, file, callback) => {
        if (exists(PATH + '/rules/' + rule)) {
            console.error(`Rule ${rule} already exists.`);
            process.exit(1);
        }
        
        if (file) {
            let content = '';
            
            try {
                content = readFile(file);
            } catch (e) {
                console.error('Cannot read file: ' + file);
                process.exit(1);
            }
            
            add(rule, content);
            return callback && callback();
        }
        
        read((error, content) => {
            if (error) {
                console.error(error.message);
                process.exit(1);
            }
            
            add(rule, content);
            callback && callback();
        });
    },
    
    tpl: (rule, tpl, callback) => {
        if (exists(PATH + '/rules/' + rule)) {
            console.error(`Rule ${rule} already exists.`);
            process.exit(1);
        }
        
        if (!exists(__dirname + '/tpl/' + tpl + '.js')) {
            console.error(`Template ${tpl} does not exist.`);
            process.exit(1);
        }
        
        let fn = require('./tpl/' + tpl + '.js');
        
        fn(ask).then(content => {
            add(rule, content);
            callback && callback();
        }).catch(error => {
            console.error(error.message);
            process.exit(1);
        });
    }
};
