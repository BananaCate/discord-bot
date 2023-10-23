const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mutes a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Chose one time format: 1m, 2h, 3d, 4w')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason you want to mute them out for')),
	async execute(interaction) {
        const botPermission = interaction.guild.members.cache.get(interaction.client.user.id).permissionsIn(interaction.channel);

        if (botPermission.has(PermissionsBitField.Flags.ModerateMembers) || botPermission.has(PermissionsBitField.Flags.Administrator)) {
            const target = interaction.options.getMember('target');
                if (target.roles.highest.position >= interaction.member.roles.highest.position) {
                    return interaction.reply("You can't timeout someone higher/equal than your highest role.");
                }
                if (target.roles.highest.position >= interaction.guild.members.cache.get(interaction.client.user.id).roles.highest.position) {
                    return interaction.reply("I can't timeout someone higher/equal than my highest role.");
                }
                if (target.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                    return interaction.reply("I can not time someone out who has time out permissions.");
                }

            const reason = interaction.options.getString('reason') ?? 'There was no reason provided';
            const timeOption = interaction.options.getString("time");
            
            const timeformat = timeOption.substring(timeOption.length-1,timeOption.length);
            const timeRest = Number(timeOption.substring(0,timeOption.length-1));

            Durationtime = 0;
            if (timeformat == "m") {
                Durationtime = timeRest * 60 * 1000;
            }
            else if (timeformat == "h") {
                Durationtime = timeRest * 60 * 60 * 1000;
            }
            else if (timeformat == "d") {
                Durationtime = timeRest * 24 * 60 * 60 * 1000;
            }
            else if (timeformat == "w") {
                Durationtime = timeRest * 7 * 24 * 60 * 60 * 1000;
            }
            
            if (Durationtime > 28*24*60*60*1000) {
                return interaction.reply({
                    content: "You have chosen a time limit above 28d", 
                    ephemeral: true
                });
            }
            //await target.timeout(Durationtime, reason);
            interaction.reply({
                content: `${target} has been muted for ${timeOption} for: \`${reason}\`.`,
                allowedMentions: { users: [], roles: [], everyone: false }
            });
        } else {
            interaction.reply('I do not have permissions to time out members.');
        }
	}
};