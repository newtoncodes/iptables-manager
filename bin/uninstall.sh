#!/usr/bin/env bash

set -e

dir=$(dirname "$0")

PATH_CONFIG=/etc/iptables-manager

sudo update-rc.d -f iptables-manager remove
