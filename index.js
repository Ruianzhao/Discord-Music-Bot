//Importing dependencies.
const { Client, IntentsBitField } = require('discord.js');
const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")

//Getting the token of the bot
dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "1191475922973503550"
const GUILD_ID = "1189965555709522010"

//Giving permission to the bot to see guilds and join calls.
const client = new Client({ 
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
    ] 
});

client.slashcommands = new Discord.Collection()

// ytdl is youtube downloader which handles the streaming of music.
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []

/* This reads all the files in the slash folder and loads all the slash commands into
the commands array. */
const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON()) 
}

// This deploys the slash commands into the guild  and allows users to call them.
if (LOAD_SLASH){
        const rest = new REST({ version: "9"}).setToken(TOKEN)
        console.log("Deploying slash commands")
        rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
        .then(() => {
            console.log("Successfully loaded")
            process.exit(0)
        })
        .catch((err) => {
            if (err){
                console.log(err)
                process.exit(1)
            }
        })
    }
    else {
        client.on("ready", () => {
            console.log(`logged in as ${client.user.tag}`)
        })
        client.on("interactionCreate", (interaction) => {
            async function handleCommand() {
                if (!interaction.isCommand()) return

                const slashcmd = client.slashcommands.get(interaction.commandName)
                if (!slashcmd) interaction.reply("Not a valid slash command")

                await interaction.deferReply()
                await slashcmd.run({client, interaction})
            }
            handleCommand()
        })
        client.login(TOKEN)
    }
    

