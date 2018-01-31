const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const config = require('../../config0');
const google = require('googleapis');

// initialize the Youtube API library
const youtube = google.youtube({
    version: 'v3',
    auth: config.Youtube_API_KEY
});


// a very simple example of searching for youtube videos
function runSamples (text) {
    return new Promise(function(resolve, reject){
        youtube.search.list({
            part: 'id,snippet',
            q: text
        }, (err, data) => {
            if (err) {
                reject(err);
            }
            let out = {};
            out.id = data.data.items[0].id.videoId;
            out.title = data.data.items[0].snippet.title;
            out.channel = data.data.items[0].snippet.channelTitle;
            out.thumbnail = data.data.items[0].snippet.thumbnails.default.url;
            resolve(out);
            console.log(data);
        });
    });
}

const youtubeIDtoURL = function(ID){
    return 'https://www.youtube.com/watch?v='+ID;
};

const youtubeLinkRegex =
    new RegExp('/(https:\\/\\/)?(www\\.)?youtu(\\.)?be(\\.com)?\\/(watch\\?v=)?\\w{11}/');
const youtubePlaylistRegex =
    new RegExp('/(https:\\/\\/)?(www\\.)?youtu(\\.)?be(\\.com)?\\/(watch\\?v=)?\\w{11}&list=/');

const getYoutubeVideoFromURL = url => {
    return ytdl(url, {filter: 'audioonly'});
};

const getYoutubeVideoFromSearch = function(search){
    return new Promise(function(resolve, reject){
        runSamples(search).then(link=>{
            resolve(link);
        });
    })
};

/**
 *
 * @param {Discord.Message} message
 * @param {string} leftover_args
 */
const handlePlayRequest = function (message, leftover_args) {
    const link = messageIsLink(leftover_args);
    if (link){
        message.channel.send('Heard a youtube song URL')
        message.guild.voiceConnection.playStream(
            getYoutubeVideoFromURL(leftover_args),{volume:0.01}
        );
    }
    else {
        getYoutubeVideoFromSearch(leftover_args)
            .then(packet => {
                sendPlayEmbed(message, packet);
                const url = youtubeIDtoURL(packet.url);
                message.guild.voiceConnection.playStream(
                    getYoutubeVideoFromURL(url),{volume:0.01}
                );

            })
    }

};

const sendPlayEmbed = function(message,packet){
    let embed = new Discord.RichEmbed();
    embed.setAuthor(packet.channel, packet.thumbnail);
    embed.setDescription(packet.title);
    message.channel.send(embed);
};

const messageIsLink = function(text){
    return text.match(youtubeLinkRegex);
};

exports.getYoutubeVideoFromURL=getYoutubeVideoFromURL;
exports.handlePlayRequest=handlePlayRequest;