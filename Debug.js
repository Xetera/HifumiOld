const dbg = require('debug');


let debug = {};
debug.silly = dbg("Bot:Silly");
debug.info = dbg("Bot:Info");
debug.warning = dbg('Bot:Warning');
debug.error = dbg("Bot:Error");

exports.debug = debug;