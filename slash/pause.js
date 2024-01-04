//Importing dependencies
const { SlashCommandBuilder } = require("@discordjs/builders")

// This creates the pause command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("pauses music"),

    // This pasus the current song that is playing.
    run: async ({client, interaction}) => {
        const queue = await client.player.nodes.get(interaction.guildId)

        if (!queue)
            return await interaction.editReply("There are no songs in the queue")

        queue.setPaused(true)
        await interaction.editReply("Music has been paused. Use `/resume` to resume the music")
    },
}