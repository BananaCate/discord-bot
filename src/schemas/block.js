const { Schema, model } = require('mongoose');
const BlockSchema = new Schema({
    userid: String
}, { versionKey: false });

module.exports = model("block", BlockSchema, "blocklist");