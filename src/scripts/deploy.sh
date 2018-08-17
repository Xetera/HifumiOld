#!/usr/bin/env bash


error="\e[31m[ERROR]   \e[0m"
success="\e[32m[SUCCESS] \e[0m"
info="\e[36m[INFO]    \e[0m"

send_webhook () {
    
    # Sends the event hook based on the event received
    # [Must be passed with a \${} input]
    
    # $1 Event name ( Error | Success )
    # $2 Title ( string of any length )
    # $2 Description ( string of any length )
    
    local eval event="$1"
    local eval title="$2"
    local eval description="$3"
    
    local username=${username:-"Digital Ocean Webhook Worker"}
    local pass_color=3066993
    local fail_color=15158332
    
    local timestamp=$(date --utc +%FT%TZ)
    local avatar=${avatar:-"https://peachsalmanac.com/wp-content/uploads/2017/08/Hifumi-new-game-768x614.jpg"}
    
    if [[ -z "$WEBHOOK_URL" ]]; then
        echo -e "$error 'WEBHOOK_URL' env variable was not set, cannot notify discord server."
        return 1
    fi
    
    if [[ "$event" == "Error" ]]; then
        echo -e "$info The request is failing"
        local color=$fail_color
        local embed_icon="https://cdn.discordapp.com/emojis/312314733816709120.png?"
    else
        echo -e "$info The request is passing"
        local color=$pass_color
        local embed_icon="https://cdn.discordapp.com/emojis/312314752711786497.png?"
    fi
    
    local data='{
        "username": "'"$username"'",
        "avatar_url": "'"https://peachsalmanac.com/wp-content/uploads/2017/08/Hifumi-new-game-768x614.jpg"'",
        "embeds": [ {
                "color": '$color',
                "author": {
                    "name": "'"Hifumi Backend"'",
                    "icon_url": "'"$embed_icon"'"
                },
                "title": "'"$title"'",
                "description": "'"$description"'",
                "timestamp": "'"$timestamp"'"
        } ]
    }'
    
    (curl --fail --progress-bar -A "Hifumi-API-Webhook" -H Content-Type:application/json -H X-Author:Xetera#9596 -d "$data" "$WEBHOOK_URL" \
    && echo -e "$info Successfully sent webhook request.") \
    || echo -e "$error Unable to send webhook request."
}

echo -e "$info Received request to post a webhook."
echo -e "$info args: $@"

# name=$(hostname)
# if [[ name != "$required_hostname" ]]; then
#     echo -e "$error Host was expected to be 'hifumi' but is instead '$name"
#     exit 1
# fi

required_hostname=${required_hostname:-"hifumi"}
event="Error"
title="Testing"
description="xoxo -Sent from my server side bash script"
send_webhook "\${event}" "\${title}" "\${description}"