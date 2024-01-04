//Importing dependencies.
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

// This creates the quit command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Stops the bot and clears the queue"),
    
    // This destroys the queue and allows the bot to leave the voice channel.
    run: async ({client, interaction}) => {
        const queue = await client.player.nodes.get(interaction.guildId)

        if (!queue)
            return await interaction.editReply("There are no songs in the queue")

        queue.destroy()
        await interaction.editReply("Bye")
    },
}