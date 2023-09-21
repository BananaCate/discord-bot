const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('splitter')
		.setDescription("Splits (spaces, new lines) something into a desired format")
        .addStringOption(option =>
            option.setName("thing")
            .setDescription("The thing you want to split")
            .setRequired(true))
        .addStringOption(option =>
            option.setName("prefix")
            .setDescription("The thing you want before each thing ({SPACE} for a space)"))
        .addStringOption(option =>
            option.setName("suffix")
            .setDescription("The thing you want behind each thing ({SPACE} for a space)")),
	async execute(interaction) {
        splitBefore = interaction.options.getString("prefix") ?? "";
        splitAfter = interaction.options.getString("suffix") ?? "";

        splitBefore = splitBefore.replace(/\\n/g, "\n");
        splitAfter = splitAfter.replace(/\\n/g, "\n");      

        splitBefore = splitBefore.replace(/{SPACE}/g, " ");
        splitAfter = splitAfter.replace(/{SPACE}/g, " ");       

        formatedThing = "";

		thing = interaction.options.getString("thing");

        thingArray = thing.split("\n");
        thing = ""
        for (i = 0; i < thingArray.length; i++) {
            thing += `${thingArray[i]} `;
        }

        thingArray2 = thing.split(",")
        thing = ""
        for (i = 0; i < thingArray2.length; i++) {
            thing += `${thingArray2[i]} `;
        }

        thingArray3 = thing.split(" ");

        for (i = 0; i < thingArray3.length; i++) {
            if (thingArray3[i] != "") {
                formatedThing += `${splitBefore}${thingArray3[i]}${splitAfter}`;
            }
        }

        interaction.reply({
            content: `\`\`\`${formatedThing}\`\`\``,
            allowedMentions: { users: [], roles: [], everyone: false }
        });
	}
};