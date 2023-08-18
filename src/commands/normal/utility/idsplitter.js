const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('idsplitter')
		.setDescription("Splits many id's into a desired format")
        .addStringOption(option =>
            option.setName("idlist")
            .setDescription("The list of id's you want to split")
            .setRequired(true))
        .addStringOption(option =>
            option.setName("prefix")
            .setDescription("The thing you want before each id"))
        .addStringOption(option =>
            option.setName("suffix")
            .setDescription("The thing you want behind each id")),
	async execute(interaction) {
        // ping issue
        splitBefore = interaction.options.getString("prefix") ?? "";
        splitAfter = interaction.options.getString("suffix") ?? "";

        splitBefore = splitBefore.replace(/\\n/g, "\n");
        splitAfter = splitAfter.replace(/\\n/g, "\n");       

        formatedIds = "";

		ids = interaction.options.getString("idlist");

        idArray = ids.split("\n");
        ids = ""
        for (i = 0; i < idArray.length; i++) {
            ids += idArray[i] + " ";
        }

        idArray2 = ids.split(",")
        ids = ""
        for (i = 0; i < idArray2.length; i++) {
            ids += idArray2[i] + " ";
        }

        idArray3 = ids.split(" ");

        for (i = 0; i < idArray3.length; i++) {
            if (idArray3[i] != "") {
                formatedIds += splitBefore + idArray3[i] + splitAfter;
            }
        }
        interaction.reply(formatedIds);
	},
};