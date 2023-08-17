const { Schema, model } = require('mongoose');
const BlockSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userid: String
})

module.exports = model("block", BlockSchema, "blocklist");