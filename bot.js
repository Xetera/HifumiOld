const Discord = require("discord.js");
const config = require("./config0.json");
let mysql = require('promise-mysql');
require('docstring');

let bot = new Discord.Client();
let login = bot.login(config.TOKEN);
bot.server_owner = 140862798832861184;  //Gives specific permissions to

class CustomUserError extends Error {
    constructor(msg, messageObject) {
        super(msg);
        this.name = 'CustomUserError';
        messageObject.channel.send(msg);
    }
}
class Func {
    static returnNullIf(message) {
        if (message.author.bot) {
            return false;
        }
        else if (message.channel.type === "dm") {
            return false;
        }
        else if (!message.content.startsWith(config.prefix)) {
            return false;
        }
        return true;

    }
    static reply(message, messageToSend) {
        let sentChannel = message.channel;
        sentChannel.send(messageToSend)
    }

    static updateGame() {
        let gameString = "";
        if (bot.guilds.size === 1) {
            gameString = "server"
        }
        else {
            gameString = "servers"
        }
        let currentlyPlaying = bot.user.setGame(`on ${bot.guilds.size} ${gameString}`);
    }

    static findCommandParams(message) {
        let params = message.content.split(' ');
        params.shift();
        let result;
        if (params instanceof Array) {
            result = params.join(' ');
        }
        else {
            result = params;
        }
        return result;
    }

    //returns the this.input after prefix
    static findFunction(message) {
        let args = message.content.substring(config.prefix.length).split(" ");
        return args[0];
    }

    static titleCase(str) {
        //capitalizes every word of the string this.input
        str = str.toLowerCase().split(' ');
        for (let i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }
    static findUser(userID) {
        return bot.users.get('id', userID).name;
    }
    static checkCommands(commandName){
        return mySql.Connect().then((conn) => {
            let query =`SELECT commandOwner FROM commands WHERE commandName='${commandName}'`;
            let result = conn.query(query);
            conn.end();
            return result;
        })
    }
    static addCommand(name){
        mySql.Connect().then((conn) => {
            let query =`REPLACE commands(commandName,commandOwner) VALUES('${name}', 'node')`;
            conn.query(query);
            conn.end();
        }). catch(function(error) {
            console.log('Duplicate key found');
        });
    }
    static commandLoop(message, commandCalled){ //updates database on every call of a function that doesn't exist
        let commands = new UserFunctions();
        let functions = Object.getOwnPropertyNames(commands);
        for (let i=0; i <functions.length;i++) {
            let funcAdd = functions[i];
            this.addCommand(funcAdd);
        }
        console.log(commandCalled);
        this.checkCommands(commandCalled).then((rows) => {
            console.log(rows);
            if (rows.length === 0){
                console.log('Command doesn\'t exist in any bot.');
            }
            else if (rows[0]['commandOwner'] === 'python'){
                return message.channel.send('Looks like you entered a command for <@313426583215931395>.' +
                                            ' I don\'t really understand Python.');
            } else {
                return message.channel.send('Hmmm.. you entered a valid command but I still called Func.commandLoop' +
                                            ', something is wrong.')
            } // can't be === node because it wouldn't enter this loop but but check anyway
        });

    }
    static searchCommand(leftover) {

    }

}
class mySql {
    static Connect() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: config.mySql.password,
            database: 'discord'
        });
    }
    static CreateTable(tableName) {
        let sqlQuery = `SHOW TABLES LIKE \'${tableName}\'`;
        this.Connect().then((conn) => {
            return conn.query(sqlQuery);
        }).then((results) => {
            if (results.length !== 0) {
                console.log("table " + tableName + " already exists.");
                return false;
            }
            console.log(tableName);
            let newSqlQuery = `CREATE TABLE ${tableName}(discordID VARCHAR(255) PRIMARY KEY, username VARCHAR(255), steamID VARCHAR(255) UNIQUE KEY)`;
            this.Connect().then((conn) => {
                let tableResults = conn.query(newSqlQuery);
                conn.end();
                console.log("Table created!");
                return tableResults;
        });
        }).catch((error) => {
            console.log(error);
            })
        };
}


bot.on("ready", async () => {
    console.log(`${bot.user.username} is ready!`);
    let link = await bot.generateInvite();
    console.log(link);
    Func.updateGame();
});


bot.on("guildCreate", async(guild) => {
    console.log(`${bot.user.username} joined ${guild.name}`);
    Func.updateGame()
});

bot.on("guildDelete", async(guild) => {
    console.log(`${bot.user.username} left ${guild.name}`);
    Func.updateGame();
});

bot.on("guildMemberAdd", async(member) => {
    const welcome = member.guild.channels.find('name', 'welcome');
    if (!welcome) {
        console.log("A new member was added but a welcome channel doesn't exist");
        return;
    }

    let embed = new Discord.RichEmbed()
        .setAuthor(member.displayName, member.user.displayAvatarURL)
        .setTimestamp()
        .setColor("GREEN")
        .setTitle(`Joined the Server!`);
    welcome.send(embed);
});
bot.on("guildMemberRemove", async(member) => {
    const goodbye = member.guild.channels.find('name', 'welcome');

    let embed = new Discord.RichEmbed()
        .setAuthor(member.displayName, member.user.displayAvatarURL)
        .setTimestamp()
        .setColor("RED")
        .setTitle(`Left the Server...`);

    goodbye.send(embed);
});

bot.on("channelCreate", (channel) => {
    try {
    let guildName = channel.guild;
    this.logs = guildName.channels.find('name', 'logs');
    if (!logs) {
        return console.log("A new channel was created but 'logs' channel doesn't exist for me to log it.")
    }
    } catch (err) {
        console.log(err);
    }
    channel.guild.fetchAuditLogs({limit: 1})
        .then((logs) => {
            console.log(logs.entries.first());
            let sender = logs.entries.first().executor['username'];
            let type = logs.entries.first().target.type;

            if (type === 'text') {
                type = "Text Channel";
            }
            else if (type === "voice") {
                type = "Voice Channel";
            }

            let sendmessage = `${sender} created a new ${type} '${channel.name}' at ${channel.createdAt}`;
            this.logs.send(`\`\`\`nginx\n${sendmessage}\n\`\`\``)
        });
});
bot.on("channelDelete", (channel) => {
    try {
        let guildName = channel.guild;
        this.logs = guildName.channels.find('name', 'logs');
    } catch (err) {
        console.log(err);
    }
    channel.guild.fetchAuditLogs({limit: 1})
        .then((logs) => {
            let sender = logs.entries.first().executor['username'];
            let sendMessage = `${sender} deleted channel '${channel.name}' at ${channel.createdAt}`;
            this.logs.send(`\`\`\`nginx\n${sendMessage}\n\`\`\``)
        });

});

bot.on("message", async (message) => {
    let validCommand = await Func.returnNullIf(message);
    //just returning empty value won't actually break out of this func
    if (!validCommand){
        return;
    }
    let sentChannel = message.channel;
    console.log(`${message.author.username}: ${message.content}`);

    let commandCalled = Func.findFunction(message);
    let paramsCalled = Func.findCommandParams(message);
    console.log("\ncommand called: " +commandCalled);
    console.log("\nparams called: " + paramsCalled + "\n");

    let userFunc = new UserFunctions();

    //if the called command is a propety name of userFunctions aka function is defined
    console.log(Object.getOwnPropertyNames(userFunc));
    console.log(Object.getPrototypeOf(userFunc));
    if (Object.getOwnPropertyNames(userFunc).includes(commandCalled.toLowerCase())){
        userFunc[commandCalled](message, paramsCalled);
    } else {
        Func.commandLoop(message, commandCalled);
        return console.log(commandCalled + " is not a defined function.\n");
    }

});

function UserFunctions() {
    this.ping = async (message) => {
        message.channel.send("pong");
    };
    this.userinfo = async (message, leftover_args) => {
        if (leftover_args) {
            let mentionedUser = message.mentions.users.first();
            let mentionedMember = message.mentions.members.first();
            this.user_username = mentionedUser.username;
            this.user_discriminator = mentionedUser.discriminator;
            this.user_avatar = mentionedUser.avatarURL;
            this.user_id = mentionedUser.id;
            this.user_creation = mentionedUser.createdAt;
            this.user_nick = mentionedMember.nickname;
            this.user_status = mentionedUser.presence.status;
            this.user_roles = mentionedMember.highestRole;
            this.user_last_message = mentionedUser.lastMessage;
            this.user_color = mentionedMember.colorRole.color;

            this.kickable = mentionedMember.kickable;
            if (this.kickable) {
                this.kickable = "Yes but I don't have the functionality yet."
            } else {
                this.kickable = "No"
            }
            if (mentionedUser.presence.game) {
                this.user_game = mentionedUser.presence.game.name;
            } else {
                this.user_game = "Not currently in game."
            }
        }
        else {
            this.user_avatar = message.author.avatarURL;
            this.user_username = message.author.username;
            this.user_discriminator = message.author.discriminator;
            this.user_id = message.author.id;
            this.user_creation = message.author.createdAt;
            this.user_nick = message.member.nickname;
            this.user_status = message.author.presence.status;
            this.user_roles = message.member.highestRole;
            this.user_last_message = message.member.lastMessage;
            this.user_color = message.member.colorRole.color;
            this.kickable = message.member.kickable;

            this.kickable = message.member.kickable;
            if (this.kickable) {
                this.kickable = "Yes but I don't have the functionality yet."
            } else {
                this.kickable = "No"
            }
            if (message.author.presence.game) {
                this.user_game = message.author.presence.game.name;
            } else {
                this.user_game = `Not currently in game`;
            }
        }

        let embed = new Discord.RichEmbed()
            .setColor(this.user_color)
            .setThumbnail(this.user_avatar)
            .addField(`Username:`, `${this.user_username}#${this.user_discriminator}`)
            .addField(`Server Nick:`, `${this.user_nick}`)
            .addField(`UserID:`, `${this.user_id}`)
            .addField(`Highest Role:`, `${this.user_roles}`)
            .addField(`Can I kick this user?:`, `${this.kickable}`, false)
            .addField(`Account Created @:`, `${this.user_creation}`)
            .addField(`Status:`, `${this.user_status}`)
            .addField(`Last Message:`, `${this.user_last_message}`)
            .addField(`Playing`, this.user_game);
        message.channel.send(embed);
    };

    this.test = async (message) => {
        message.channel.send("working");
    };

    this.csgo = async(message, leftover_args) => {
        await message.channel.send("This command is disabled because steam is a piece of shit that doesn't have " +
            "a public csgo API.").delete(10 * 1000);
        /*
        let file = require('./test.js');
        await file.run(async (callback) => {
            message.channel.send(callback);
        });
        */
    };

    this.uptime = async (message) => {
        let uptime;
        uptime = (bot.uptime / 1000.0).toFixed(2);
        this.uptimeMessage = uptime + " seconds.";
        console.log(uptime);
        if (uptime > 60.0) {
            uptime = (uptime / 60.0).toFixed(2);
            if (uptime > 60.0) {
                uptime = (uptime / 60.0).toFixed(2);
                this.uptimeMessage = uptime + ` hours.`;
            } else {
                this.uptimeMessage = uptime + ` minutes.`;
            }
        }
        message.channel.send(`I have been online for ` + this.uptimeMessage)
    };
    this.brawlhalla = async (message, leftover_args) => {

        this.input = leftover_args;
        if (!this.input) {
            let response = await message.channel.send(`Usage:\n${config.prefix}brawlhalla [STEAM64] or [@user]`
                + `\n sends brawlhalla stats when a user is @mentioned or a steamID is entered`);
            response.delete(20 * 1000);
            return;
        }
        if (isNaN(this.input)) {
            if (message.mentions.users) {
                try {
                    console.log(message.mentions.users.first());
                    let userMentionedID = message.mentions.users.first().id;
                    let userMentionedName = message.mentions.users.first().username;
                    console.log(userMentionedID);
                    mySql.Connect().then((conn) => {
                        let result = connection.query(`SELECT steamID FROM steam WHERE discordID=${userMentionedID}`);
                        conn.end();
                        return result;
                    }).then((row) => {
                        console.log("row length " + row.length);
                        if (row.length === 0) {
                            throw new CustomUserError(`${userMentionedName} does not have their steamID saved on discord.` +
                                `\nUse ${config.prefix}setSteam [steamID] to save your steamID.`, message);
                        }
                        console.log(row[0]['steamID']);
                        this.input = row[0]['steamID'];
                        console.log(this.input);

                    }).catch((error) => {
                        if (error instanceof CustomUserError)
                            return;
                        return console.log(error);
                    });
                } catch (err) {
                    console.log("here:  " + err);
                    if (err instanceof CustomUserError) {
                        return;
                    }
                }
            }
        }

        this.input = this.input.toString();
        console.log('done');
        let waitMessage = await message.channel.send("Contacting Brawlhalla API...");
        const brawlDB = require('./Commands/API/Brawlhalla.js');

        await brawlDB.callData(this.input, async (trace) => {
            console.log("async working");
            if (!trace) {
                message.channel.send("Something went wrong :sob: ")
            }

            brawlDB.findRankedData(this.input, xtrace => {
                console.log(xtrace);


                let legendStats = [];
                for (let i = 0; i < trace.legends.length; i++) {
                    let legend = trace.legends;
                    let legendName = Func.titleCase(legend[i]['legend_name_key']);
                    legendStats[i] = [legend[i]['level'], legendName, legend[i]['games'],
                        legend[i]['wins'], legend[i]['kos'], legend[i]['falls'], legend[i]['suicides']]

                    //level, name, games, wins, KOs, falls, suicides
                }

                legendStats = legendStats.sort(function (a, b) {
                    return b[0] - a[0]
                });

                console.log(legendStats);
                try {
                    this.clanName = (trace.clan.clan_name)
                } catch (err) {
                    this.clanName = "ClanNotFound"
                }
                let embed = new Discord.RichEmbed();
                if (this.clanName !== "ClanNotFound") {
                    embed.setTitle(`${trace.name} of ${this.clanName}\n`)
                } else {
                    embed.setTitle(`${trace.name}`)
                }
                embed.setColor(message.member.colorRole.color)
                    .setThumbnail("http://beta.brawlhalla.com/static/i/bhfb1200.png")
                    .addField(`Level:`, trace.level, true)
                    .addField(`Rank:`, xtrace.tier, true)
                    .addField(`Current ELO:`, xtrace.rating, true)
                    .addField(`Peak ELO:`, xtrace.peak_rating, true)
                    .addField(`Games Played:`, trace.games, true)
                    .addField(`Games Won:`, trace.wins, true);
                console.log("set fields");
                if (legendStats.length < 12) {
                    this.loopSize = legendStats.length;
                } else {
                    this.loopSize = 12;
                }
                for (let x = 0; x < this.loopSize; x++) {
                    embed.addField(legendStats[x][1],
                        `Level: ${legendStats[x][0]}\n` +
                        `Games Played: ${legendStats[x][2]}\n` +
                        `Games Won: ${legendStats[x][3]}\n` +
                        `% Win Rate: ${(legendStats[x][3] / legendStats[x][2] * 100).toFixed(2)}\n` +
                        `KOs: ${legendStats[x][4]}\n` +
                        `Falls: ${legendStats[x][5]}\n`, true);
                }

                waitMessage.delete();
                message.channel.send(embed);
            })
        });

    };
    this.setSteam = (message, leftover_args) => {
        if (!leftover_args) {
            return message.channel.send("No SteamID was provided.");
        }
        if (isNaN(leftover_args)) {
            return message.channel.send(`${leftover_args} is not a steam64ID.`)
        }
        try {
            mySql.CreateTable("steam");
            let sqlConnection;
            mySql.Connect().then(function (conn) {
                sqlConnection = conn;
                return conn.query(`SELECT steamID FROM steam WHERE discordID=\'${message.author.id}\'`);
            }).then((result) => {
                console.log("here is teh result");
                console.log(result);
                if (result.length > 0) {
                    console.log(result.steamID);
                    throw new CustomUserError(`Your SteamID is already in the database as ${result[0]['steamID']} if` +
                        ` you want, you may change it with .clearSteam`, message);
                }

                this.insertResult = sqlConnection.query(`INSERT INTO steam(discordID, username, steamID) VALUES(${message.author.id}, ` +
                    `\'${message.author.username}\',${leftover_args})`);

                console.log(this.insertResult);
                sqlConnection.commit();

                process.on("unhandledRejection", (error) => {
                    if (error.code === "ER_DUP_ENTRY") {
                        throw new CustomUserError("Your Steam ID already exists in the database", message)
                    }
                    else {
                        console.log(error)
                    }
                });
                message.channel.send(`SteamID added! :ok_hand:`);
                sqlConnection.end();
            }).catch((err) => {
                if (err instanceof CustomUserError) {
                    return;
                }
                return console.error(err);

            });
        } catch (err) {
            if (err instanceof CustomUserError) {
                return;
            }
            return console.log(err);
        }

    };
    this.setsteam = (message, leftover_args) => {
        this.setSteam(message, leftover_args);
    };
    this.clearSteam = (message, leftover_args) => {
        if (leftover_args) {
            message.channel.send(`Ignoring ${leftover_args}, .clearSteam only clears the caller's steamID and doesn't take arguments.`)
        }
        let connection;
        mySql.Connect().then((conn) => {
            connection = conn;
            return connection.query(`SELECT steamID FROM steam WHERE discordID=${message.author.id}`);

        }).then((rows) => {
            if (rows.length === 0) {
                throw new CustomUserError("You have not set your steamID yet.")
            }
            message.channel.send(`Your steamID was ${rows[0]['steamID']}.`);
            return connection.query(`DELETE FROM steam WHERE discordID=${message.author.id}`);
        }).then((rows) => {
            connection.commit();
            connection.end();
            return message.channel.send("There was an error clearing your SteamID, check console for details.");
            
        });
        
        message.channel.send("SteamID cleared! :ok_hand:");
        
    };
    this.help = async (message) => {
        let commandArray = Object.getOwnPropertyNames(this);
        let finalMessage;
        for (let i in commandArray) {
            let stringed = i.toString();
            finalMessage += `${i.toString()}: ${this.stringed.__doc__}`
        }
        message.channel.send(finalMessage)
    };
    this.nick = (message, leftover_args) => {
      bot.user.setUsername(leftover_args)
          .then(user => {
              message.channel.send(`Changed my name to ${user.username}`)
          }).catch(error => {
              console.log(error);
      })
    };
    this.eval = (message, leftover_args) => {
        return; //too easy to break atm
        if (!message.author.id === bot.server_owner) {
            return message.channel.send(`You do not have permission to use the eval function`)
        }
        if (!leftover_args) {
            return message.channel.send("Please enter a command to evaluate.")
        }
        try {
            let evalled = eval((leftover_args)).toString();
            if (evalled.includes(config.TOKEN)) {
                return message.channel.send("Couldn't eval, response includes token.")
            }
            message.channel.send(evalled);
        }
        catch (error) {
            console.log(error);
            return message.channel.send(error.toString());
        }
        process.on("unhandledRejection", (error) => {
            return message.channel.send(error.toString());
        });

    };

}