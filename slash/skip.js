//Importing dependencies.
const { SlashCommandBuilder } = require("@discordjs/builders")

// This creates the skip command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("skips the current song"),
    
    // This skips to the next song in the queue.
    run: async ({client, interaction}) => {
        const queue = await client.player.nodes.get(interaction.guildId)

        if (!queue)
            return await interaction.editReply("There are no songs in the queue")

            const currentSong = queue.current

        queue.skip
        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(`${currentSong.title} has been skipped!`).setThumbnail(currentSong.thumbnail)
            ]
        })
    },
}