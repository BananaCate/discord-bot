const { Schema, model } = require('mongoose');
const membercountSchema = new Schema({
    serverid: String,
    messages: Array,
    oldmembercount: String
}, { versionKey: false });

module.exports = model("membercounts", membercountSchema);