const { inviteModel } = require('../../schemas/invites.js');

module.exports = {
	name: 'inviteDelete',
	async execute(invite) {
        currentServer = await inviteModel.findOne({ serverId: invite.guild.id});

        const indexToRemove = currentServer.invites.findIndex(inv => inv.code === invite.code);
		currentServer.invites.splice(indexToRemove, 1);
		
		await currentServer.save();
	},
};