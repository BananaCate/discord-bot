const { Schema, model } = require('mongoose');

const inviteSchema = new Schema({
    serverId: String,
    inviteLogId: { type: String, required: false },
    invites: Array,
    users: Array
}, { versionKey: false });

const inviteModel = model("invites", inviteSchema);

module.exports = { inviteModel };