#!/bin/sh
export ANSIBLE_HOST_KEY_CHECKING=False
rm inventory
node DigitialOcean.js
node AWS.js
ansible-playbook playbook.yml -i inventory

