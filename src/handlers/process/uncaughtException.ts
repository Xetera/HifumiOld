export default function uncaughtException(){
    process.on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        console.error('This should be looked into and the bot should preferably be restarted');
    });
}