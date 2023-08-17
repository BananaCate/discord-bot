const { Schema, model } = require('mongoose');
const DeveloperSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userid: String,
    permission: String
}, { versionKey: false });

module.exports = model("developer", DeveloperSchema, "devlist");