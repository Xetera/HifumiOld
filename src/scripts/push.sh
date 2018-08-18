#!/usr/bin/env bash

error="\e[31m[ERROR]   \e[0m"
success="\e[32m[SUCCESS] \e[0m"
info="\e[36m[INFO]    \e[0m"

user=${1:-"Xetera"}
repo=${2:-"Hifumi"}
checkout_from=${branch:-"staging"}

project_name=$( basename $( git rev-parse --show-toplevel ) )

# Must be in the right git repository for this to work
if [[ $project_name != $repo ]]; then
    if [[ -n "$project_name" ]]; then
        echo "$error Not in a project repository"
    else
        echo "$error Current project was expected to be $repo but is $project_name"
    fi
    exit 1
fi

echo -e "$info Checking the latest test on branch '$checkout_from'..."

result=$( curl -s "https://api.travis-ci.org/$user/$repo.svg?branch=$checkout_from" )

data=$( grep "passing" <<< $result )

# checking if passing is found inside the html
# I don't know if there's a better way to do this
# but this seems to work fine for now
if [[ -z "$data" ]]; then
    echo -e "$error Repo in $user/$repo:$checkout_from has not passed tests, exiting deployment!"
    exit 1
else
    echo -e "$info Target branch '$checkout_from' has passed the latest tests."
fi

# getting the current branch name from git
current_branch=$( git rev-parse --abbrev-ref HEAD )
target_branch="staging"

if [[ $current_branch != $target_branch ]]; then
    echo -e "$info Current branch is not $target_branch, attempting to checkout..."

    checkout={git checkout master} &> /dev/null
    errored=$( grep "error" <<< $checkout )

    if [[ -z $errored ]]; then
        echo -e "$error Could not checkout to $target_branch branch, exiting deployment!"
        exit 1
    fi
fi

echo $current_branch
