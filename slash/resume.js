//Importing dependencies.
const { SlashCommandBuilder } = require("@discordjs/builders")

//This creates the resume command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("resumes the music"),
    
    // This unpauses the song that was playing.
    run: async ({client, interaction}) => {
        const queue = await client.player.nodes.get(interaction.guildId)

        if (!queue)
            return await interaction.editReply("There are no songs in the queue")

        queue.setPaused(false)
        await interaction.editReply("Music has been paused. Use `/resume` to resume the music")
    },
}