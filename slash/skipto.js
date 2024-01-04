//Importing dependencies.
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

//This creates the skipto command, which skips to a specific track number.
module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("skips to a specific track #")
        .addNumberOption((option) => 
        option.setName("tracknumber").setDescription("The track tos kip to").setMinValue(1).setRequired(true)),
    
    //This skips to the specified track by the user.
    run: async ({client, interaction}) => {
        const queue = await client.player.nodes.get(interaction.guildId)

        if (!queue)
            return await interaction.editReply("There are no songs in the queue")

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length)
            return await interaction.editReply("Invalid track number")
        queue.skipTo(trackNum - 1)

        await interaction.editReply(`Skipped ahead to track number ${trackNum}`)
    },
}