//Importing dependencies.
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

// This creates the queue command to allow the user to see the queue of songs.
module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue")
    .addNumberOption((option) => option.setName("page").setDescription("Page number of the queue").setMinValue(1)),

    // This creates the queue and limits to 10 tracks per page
    run: async ({ client, interaction }) => {
        const queue = await client.player.nodes.get(interaction.guildId)
        if (!queue || !queue.playing) {
            return await interaction.editReply("There are no songs in the queue")
        }

        //Bot only displays 10 tracks per page.
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1 

        if (page > totalPages)
            return await interaction.editReply(`Invalid Page. There are only a total of ${totalPages} pages of songs`)

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\'${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.currentSong

        // This replys to the user information about the current song and the queue.
        await interaction.editReply ({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Currently Playing**\n` +
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                    `\n\n**Queue**\n${queueString}`
                    )
                    .setFoorter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}