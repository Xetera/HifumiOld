#!/usr/bin/env bash

error="\e[31m[ERROR]\e[0m"
success="\e[32m[SUCCESS]\e[0m"

user=${1:-"Xetera"}
repo=${2:-"Hifumi"}
branch=${branch:-"staging"}

project_name=$(basename $(git rev-parse --show-toplevel))

if [[ $project_name != $repo ]]; then
    if [[ -n "$project_name" ]]; then
        echo "$error Not in a project repository"
    else
        echo "$error Current project was expected to be $repo but is $project_name"
    fi
    exit 1
fi

result=$( curl -s "https://api.travis-ci.org/$user/$repo.svg?branch=$branch" )

data=$( grep "pass" <<< $result )

if [[ -z "$data" ]]; then
    echo -e "$error Repo in $user/$repo:$branch has not passed tests, exiting deployment..."
    exit 1
else
    echo -e "$success Repo is passing tests!"
fi

resp=$( git branch )