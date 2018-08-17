#!/usr/bin/env bash

required_hostname=${required_hostname:-"hifumi"}

error="\e[31m[ERROR]\e[0m"
success="\e[32m[SUCCESS]\e[0m"
info="\e[32m[INFO]\e[0m"

name=$(hostname)
if [[ name != $required_hostname ]]; then 
    echo -e "$error Host was expected to be 'hifumi' but is instead '$name"
    exit 1
fi