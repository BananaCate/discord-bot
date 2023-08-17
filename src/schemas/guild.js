const { Schema, model } = require('mongoose');
const guildSchema = new Schema({
    guildId: String,
    guildName: String,
    guildIcon: { type: String, required: false }
}, { versionKey: false });

module.exports = model("guild", guildSchema, "guilds");