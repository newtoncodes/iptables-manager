# Iptables manager

Manage iptables easier. Just simple bash scripts.

The best feature of iptables manager is the templates. Just type: `sudo ipm tpl RULE_NAME input` and it will ask you everything you need 99.9% of the time.
Or type `ipm tpl --help` to get a list of all templates.

- Basic policies are saved in **/etc/iptables/manager/vars.env**.
- All scripts are saved in **/etc/iptables/manager/rules**.

A "rule" in iptables manager is basically a bash script that executes whatever you write in it.
Of course, we should use it with the iptables command. Example:

```bash
# Allow all input

iptables -A INPUT  -p tcp -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp -m state --state ESTABLISHED     -j ACCEPT
```

A service called iptables-manager will be created on install and you should start it with:
```bash
sudo service iptables-manager start
sudo service iptables-manager restart
sudo service iptables-manager stop
```

**On start/restart, iptables is reset with -F and then all rule scripts are executed.**

On install, a basic rule will be added to allow all tcp traffic, otherwise you will be kicked
out of the server, if you are using ssh, vnc or anything like that.
After you setup your ssh rules, you must delete the all-default rule.
```bash
sudo ipm remove all-default
```
Another rule will be created by default on install: `output-all`. It allows all outgoing traffic. That's the default setting for most servers.
If you want to remove it:
```bash
sudo ipm remove output-all
```

## Usage

```
ipm --help # If the ipm command is used, use iptables-manager
iptables-manager --help

Usage: ipm <cmd> <args ...>

Commands:
  ipm add <rule> [file]  Add a rule from a file or stdin.
  ipm tpl <rule> <tpl>   Add a rule from a template.
  ipm edit <rule>        Edit a rule script with nano.
  ipm remove <rule>      Remove a rule (requires reload).
  ipm get <rule>         Show a rule script.
  ipm list               List all rules.
  ipm run [rule]         Run a single rule or all rules.
  ipm reload             Reload all rules.
  ipm install            Run install script.

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

- `ipm add` can be used with pipe like `cat file.sh | sudo ipm add RULE_NAME` or `sudo ipm add RULE_NAME < file.sh`.
- `ipm add` should only be used if you really need custom things or you want to use ipm as an API for another app. In most cases just use `ipm tpl`.
- `ipm tpl` can add multiple rules with one command in one rule file.
- **Read the stdout carefully and you should be OK.**

## Install node

```bash
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -; sudo apt-get install -y nodejs
```

## Install iptables-manager

**If you are installing as root:**

```bash
npm install -g --unsafe-perm iptables-manager
```

For normal users:

```bash
npm install -g iptables-manager
```

The install script will install the required directory structure. If you don't see: `All done.` or
`Configs already exist.`, you will need to run `ipm install` later. To check if install is ok, run:
```bash
cat /etc/iptables-manager/vars.env
```
And you should see something like:
```bash
POLICY_INPUT=DROP
POLICY_OUTPUT=DROP
POLICY_FORWARD=DROP

LOG_SPAM=1
```

