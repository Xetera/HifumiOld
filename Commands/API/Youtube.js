const ytdl = require('ytdl-core');

exports.getYoutubeVideo = url => {
    return ytdl(url, {filter: 'audioonly'});
};


