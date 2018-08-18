#!/usr/bin/env bash

error="\e[31m[ERROR]   \e[0m"
success="\e[32m[SUCCESS] \e[0m"
info="\e[36m[INFO]    \e[0m"
out=""

SECONDS=0

log() {
    out+="$@\n"
}

send_webhook () {
    # Sends the event hook based on the event received

    # Uses global variables:
    # $event - Type of embed, (Error | Success)
    # $title - Title of the embed
    # $out   - The current error log

    local username=${username:-"Digital Ocean Webhook Worker"}
    local pass_color=3066993
    local fail_color=15158332

    local timestamp=$( date --utc +%FT%TZ )
    local avatar=${avatar:-"https://peachsalmanac.com/wp-content/uploads/2017/08/Hifumi-new-game-768x614.jpg"}

    if [[ -z "$WEBHOOK_URL" ]]; then
        echo -e "$error 'WEBHOOK_URL' env variable was not set, cannot notify discord server."
        return 1
    fi

    if [[ "$event" == "Error" ]]; then
        echo -e "$info The request is failing"
        local color=$fail_color
        local embed_icon="https://cdn.discordapp.com/emojis/312314733816709120.png"
        local footer="Deployment failed, Hifumi will NOT be restarted."
    else
        echo -e "$info The request is passing"
        local color=$pass_color
        local embed_icon="https://cdn.discordapp.com/emojis/312314752711786497.png"
        local footer="Deployment successful! Hifumi has been restarted."
    fi

    log ""
    log "Build #$deploys was completed in $SECONDS seconds."

    local data='{
        "username": "'"$username"'",
        "avatar_url": "'"https://peachsalmanac.com/wp-content/uploads/2017/08/Hifumi-new-game-768x614.jpg"'",
        "embeds": [ {
                "color": '$color',
                "author": {
                    "name": "'"Hifumi Backend"'",
                    "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/1200px-GraphQL_Logo.svg.png"
                },
                "title": "'"$title"'",
                "description": "'"$out"'",
                "footer": {
                    "icon_url": "'"$embed_icon"'",
                    "text": "'"$footer"'"
                },
                "timestamp": "'"$timestamp"'"
        } ]
    }'

    (curl --fail --progress-bar -A "Hifumi-API-Webhook" -H Content-Type:application/json -H X-Author:Xetera#9596 -d "$data" "$WEBHOOK_URL" \
    && echo -e "$info Successfully sent webhook request.") \
    || echo -e "$error Unable to send webhook request."
}

handle_missing_redis () {
    echo -e "$info Redis 'number_of_deployments' variable was not set"
    typeset -i deploys=0
}

if ! hash redis-cli 2> /dev/null; then
    echo -e "$error This script relies on redis-cli to track deployment count" \
    "make sure you have it in your PATH in order to track statistics."
    redis_enabled=0
else
    redis_enabled=1
fi

echo -e "$info Received request to post a webhook."

if [[ $redis_enabled -eq 1 ]]; then
    echo -e "$info Fetching deploy count from Redis"

    {
        typeset -i deploys=$( redis-cli get number_of_deployments )
    } || handle_missing_redis

    # we can safely increment this number at this point

    # if the number is not found, casting it to an int
    # will return a 0 which will correctly get incremented to 1
    redis-cli set number_of_deployments $((deploys + 1))
fi

# Hard fetching:
echo -e "$info Fetching all from github."
git fetch --all

echo -e "$info Hard resetting branch to origin."
git reset --hard origin/staging

echo -e "$info Compiling files..."

# typescript CLI is pretty formatter by default, we don't want that

# IMPORTANT: Windows is shitty. because this script is meant to be
# used in my regular work environment (which unfortunately is windows)
# we have to specifically remove the carriage returns if we want to
# concat this response to a string otherwise it carries over the (",)
# portion of the stdout to the embed which messed up everything

# god I hate Windows...
tsc_result=$( tsc --pretty false | tr -d '\r')

if [[ ! -z $tsc_result ]]; then
    echo -e "$error Compilation error received from tsc."
    event="Error"
    title="Compilation Error"
    log "Encountered an error while running the command **tsc**"
    log ""
    log "$tsc_result"
    send_webhook
    exit 1
fi

echo -e "$info Restarting Hifumi and delaying confirmation 5 secs to check process"

pm2 restart hifumi
# pm2 will sleep the process here for 5 seconds so we don't have to

status=$( pm2 status | awk '/hifumi/ {print $10}' )

if [[ $status != "online" ]]; then
    echo -e "$error Could not successfully start up pm2 after 5 seconds"
    event="Error"
    title="PM2 startup error"
    log "**Hifumi** process on PM2 was not found to be online after" \
    "waiting for 5 seconds."
    log "Check the server logs for more info."
    send_webhook
    exit 1
fi

# Everything good at this point
echo -e "$success Build successful, notifying Discord server."
event="Success"
title="Fetched, built and reloaded successfully!"
log "Hifumi should be up and running now!"

send_webhook
