#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const exists = require('fs').existsSync;
const access = require('fs').accessSync;
const W_OK = require('fs').W_OK;

const add = require('../src/add').add;
const tpl = require('../src/add').tpl;
const remove = require('../src/remove');
const run = require('../src/run');
const reload = require('../src/reload');

const checkInstall = () => {
    if (!exists('/etc/iptables-manager/rules') || !exists('/etc/iptables-manager/vars.env')) {
        console.error(`Please run ipm install.`);
        process.exit(1);
    }
};

const checkRoot = () => {
    try {
        access('/etc', W_OK);
    } catch (e) {
        console.error('Please run as root or use sudo.');
        process.exit(1);
    }
};

const options = {
    rule: {
        name: 'rule',
        description: 'Rule name/key.',
        type: 'string',
        
        coerce: (rule) => {
            rule = rule.trim().toLowerCase();
            if (!rule) throw new Error('Invalid rule name.');
            
            return rule;
        }
    },
    
    tpl: {
        name: 'tpl',
        description: 'Template name.',
        type: 'string',
        choices: [
            'input',
            'input-all',
            'input-dns',
            'input-http',
            'input-ping',
            'input-ssh',
            'input-ssh-vpn',
            'output',
            'output-all'
        ]
    },
    
    file: {
        name: 'file',
        description: 'File path.',
        type: 'string'
    }
};

const commands = {
    add: {
        command: 'add <rule> [file]',
        description: 'Add a rule from a file or stdin.',
        
        builder: (yargs) => yargs
            .positional('rule', options.rule)
            .positional('file', options.file),
        
        handler: (argv) => {
            checkRoot();
            checkInstall();
            add(argv.rule, argv.file, () => process.exit());
        }
    },
    tpl: {
        command: 'tpl <rule> <tpl>',
        description: 'Add a rule from a template.',
        
        builder: (yargs) => yargs
            .positional('rule', options.rule)
            .positional('tpl', options.tpl),
        
        handler: (argv) => {
            checkRoot();
            checkInstall();
            tpl(argv.rule, argv.tpl, () => process.exit());
        }
    },
    remove: {
        command: 'remove <rule>',
        description: 'Remove a rule (requires reload).',
    
        builder: (yargs) => yargs
            .positional('rule', options.rule),
    
        handler: (argv) => {
            checkRoot();
            checkInstall();
            remove(argv.rule);
            process.exit();
        }
    },
    run: {
        command: 'run [rule]',
        description: 'Run a single rule or all rules.',
    
        builder: (yargs) => yargs
            .positional('rule', options.rule),
    
        handler: (argv) => {
            checkRoot();
            checkInstall();
            run(argv.rule);
            process.exit();
        }
    },
    reload: {
        command: 'reload',
        description: 'Reload all rules.',
        
        builder: (yargs) => yargs,
        
        handler: () => {
            checkRoot();
            checkInstall();
            reload();
            process.exit();
        }
    },
    install: {
        command: 'install',
        description: 'Run install script.',
        
        builder: (yargs) => yargs,
        
        handler: () => {
            checkRoot();
            require('child_process').execSync('bash ' + __dirname + '/install.sh', {stdio: 'inherit'});
            process.exit();
        }
    }
};


yargs
    .wrap(null)
    .usage('Easy to use iptables management.\n\nUsage: $0 <cmd> <args ...>')
    .demandCommand(1, 1, 'You must specify a command.', 'You must specify max one command.')
    .command(commands['add'])
    .command(commands['tpl'])
    .command(commands['remove'])
    .command(commands['run'])
    .command(commands['reload'])
    .command(commands['install'])
    .help();

if (!commands[yargs.argv['_'][0]]) {
    yargs.showHelp('log');
    process.exit();
}
