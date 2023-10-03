const { Schema, model } = require('mongoose');
const membercountSchema = new Schema({
    membercount: String
}, { versionKey: false });

module.exports = model("membercounts", membercountSchema);