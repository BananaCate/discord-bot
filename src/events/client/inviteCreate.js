const { inviteModel } = require('../../schemas/invites.js');

module.exports = {
	name: 'inviteCreate',
	async execute(invite) {
        currentServer = await inviteModel.findOne({ serverId: invite.guild.id});

		currentServer["invites"].push({code: invite.code, amount: String(invite.uses)})
		currentServer.save();
	},
};