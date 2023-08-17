const { Schema, model } = require('mongoose');
const DeveloperSchema = new Schema({
    userid: String,
    permission: String
}, { versionKey: false });

module.exports = model("developer", DeveloperSchema, "devlist");