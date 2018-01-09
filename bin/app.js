#!/usr/bin/env node

'use strict';

const yargs = require('yargs');

const add = require('../src/add').add;
const tpl = require('../src/add').tpl;
const remove = require('../src/remove');
const run = require('../src/run');
const reload = require('../src/reload');


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
            'all',
            
            'output-all',
            'output-ping',
            'output-ssh',
            'output-http',
            
            'input-all',
            'input-ping',
            'input-ssh',
            'input-http',
            'input-docker-swarm'
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
            add(argv.rule, argv.tpl);
        }
    },
    tpl: {
        command: 'tpl <rule> <tpl>',
        description: 'Add a rule from a template.',
        
        builder: (yargs) => yargs
            .positional('rule', options.rule)
            .positional('tpl', options.tpl),
        
        handler: (argv) => {
            tpl(argv.rule, argv.tpl);
        }
    },
    remove: {
        command: 'remove <rule>',
        description: 'Remove a rule (requires reload).',
    
        builder: (yargs) => yargs
            .positional('rule', options.rule),
    
        handler: (argv) => {
            remove(argv.rule);
        }
    },
    run: {
        command: 'run [rule]',
        description: 'Run a single rule or all rules.',
    
        builder: (yargs) => yargs
            .positional('rule', options.rule),
    
        handler: (argv) => {
            run(argv.rule);
            process.exit();
        }
    },
    reload: {
        command: 'reload',
        description: 'Reload all rules.',
    
        builder: (yargs) => yargs,
    
        handler: () => {
            reload();
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
    .help();

if (!commands[yargs.argv['_'][0]]) {
    yargs.showHelp('log');
    process.exit();
}
