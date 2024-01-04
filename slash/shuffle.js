//Importing dependencies.
const { SlashCommandBuilder } = require("@discordjs/builders")

// This creates the shuffle command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the songs in the queue"),

    // This shuffles the queue.
    run: async ({client, interaction}) => {
        const queue = await client.player.nodes.get(interaction.guildId)

        if (!queue)
            return await interaction.editReply("There are no songs in the queue")

        queue.shuffle()
        await interaction.editReply(`The queue of ${queue.tracks.length} songs have been shuffled!`)
    },
}