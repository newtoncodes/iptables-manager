'use strict';

const read = require('read-input');
const exec = require('child_process').execSync;
const mkdir = require('fs').mkdirSync;
const exists = require('fs').existsSync;
const readFile = require('fs').readFileSync;
const writeFile = require('fs').writeFileSync;
const readline = require('readline');

const PATH = __dirname + '/../config';


const add = (rule, content) => {
    if (exists(PATH + '/rules/' + rule)) {
        console.error(`Rule ${rule} already exists.`);
        process.exit(1);
    }
    
    try {
        if (!exists(PATH + '/rules/')) mkdir(PATH + '/rules');
        writeFile(PATH + '/rules/' + rule, content.trim() + '\n', 'utf8');
        exec('chmod 600 ' + PATH + '/rules/' + rule, {stdio: 'inherit'});
        
        console.log('\nRules written to file: ' + PATH + '/rules/' + rule);
    } catch (e) {
        console.error(`Could not write to file: ${PATH + '/rules/' + rule}`);
        console.error(e.message);
        process.exit(1);
    }
};

module.exports = {
    add: (rule, file, callback) => {
        if (exists(PATH + '/rules/' + rule)) {
            console.error(`Rule ${rule} already exists.`);
            process.exit(1);
        }
        
        if (file) {
            let content = '';
            
            try {
                content = readFile(file, 'utf8');
            } catch (e) {
                console.error('Cannot read file: ' + file);
                process.exit(1);
            }
            
            add(rule, content);
            return callback && callback();
        }
        
        read([], (error, content) => {
            if (error) {
                console.error(error.message);
                process.exit(1);
            }
            
            add(rule, content.data);
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
    
        readline.rli = readline.rli || readline.createInterface({input: process.stdin, output: process.stdout});
        const ask = require('util').promisify((q, c) => readline.rli.question(q, a => c(null, a)));
        
        fn(ask).then(content => {
            add(rule, '#!/bin/bash\n\n' + content.trim());
            callback && callback();
        }).catch(error => {
            console.error(error.message);
            process.exit(1);
        });
    }
};
