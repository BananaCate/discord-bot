const roleIds = ['1143546572790059079','1143546598727622746','1143546623314641056','1143546668172722267','1143546702566019123','1143546728415494260','1143546760602603550'];
const roleNames = ['red','orange','yellow','green','cyan','blue','purple'];

module.exports = {
    data: {
        name: 'role'
    },
    async execute(interaction, data) {
        const member = interaction.member;

        const hasRole = roleIds.some(roleid => member.roles.cache.find(role => role.id === roleid));

        let assignedRoleId = null;

        roleIds.some(roleId => {
            if (member.roles.cache.has(roleId)) {
                assignedRoleId = roleId;
            }
        });

        content = ""
        if (assignedRoleId) {
            content = `I removed the color <@&${assignedRoleId}>,`
            await member.roles.remove(assignedRoleId);
        }
        
        await member.roles.add(roleIds[roleNames.indexOf(data)]);
        interaction.reply({
            content: `${content}\nI gave you the color <@&${roleIds[roleNames.indexOf(data)]}>`,
            ephemeral: true
        })
    }
}