const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-eval')
		.setDescription('Run a command on the vps')
        .addStringOption(option =>
            option.setName("input")
            .setDescription("The command & arguments you want to run in the cmd of the vps.")
            .setRequired(true)),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);
		const input = interaction.options.getString("input");

        if (!botPermission.has(PermissionsBitField.Flags.SendMessages)) {
            return interaction.reply("I am unable to send messages here :c");
        }

        function runLS() { return new Promise((resolve, reject) => { 
            exec(input, (error, stdout, stderr) => { if (error) { reject(`exec error: ${error}`); return; } resolve(stdout); }); 
        });} 

        async function sendEmbeds(content) { 
            const maxEmbedCharCount = 4000; 
            
            let remaining = content; 
            for (let i = 0; i < 5 && remaining.length > 0; i++) { 
                let segment; 
                if (remaining.length > maxEmbedCharCount - 10) { 
                    segment = remaining.substring(0, maxEmbedCharCount - 10); 
                    let lastNewLineIndex = segment.lastIndexOf("\n"); 
                    if (lastNewLineIndex !== -1) { 
                        segment = segment.substring(0, lastNewLineIndex); 
                    } 
                } 
                else { segment = remaining; } 

                await interaction.channel.send({ embeds: [{ title: `${input} embed: ${i+1}`, description: `\`\`\`js\n${segment}\`\`\`` }] }); 
                remaining = remaining.substring(segment.length); 
            } 
            
            if (remaining.length > 0) { 
                console.warn("File content is too long to fit in 5 embeds!"); 
            } 
        } 

        const result = await runLS(); 
        await sendEmbeds(result);
	}
};