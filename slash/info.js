//Importing dependencies.
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

// This creates the info command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays information about the current song"),

    /* This displays information about the current song that is playing, such
    as the thumbnail, name, url and a visual time indicator. */
    run: async ({client, interaction}) => {
        const queue = await client.player.nodes.get(interaction.guildId)

        if (!queue)
            return await interaction.editReply("There are no songs in the queue")

        let bar = queue.createProgressBar({
            queue: false,
            length: 19
        })

        const song = queue.current

        await interaction.editReply({
            embeds: [new MessageEmbed()
                .setThumbnail(song.thumbnail)
                .setDescription(`Currently Playing [${song.title}] (${song.url})\n\n` + bar)
            ],
            
        })
    },
}