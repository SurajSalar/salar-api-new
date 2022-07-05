const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const MessageSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    ticketId: { type: Schema.Types.ObjectId, ref: 'supportTickets' },
    message: { type: String },
    role: { type: String, enum : ['user','admin']},
    isDeleted: { type: Boolean, default: false }
},{ timestamps: true });

const Messages = mongoose.model('messages', MessageSchema);

module.exports = {
    Messages: Messages,
}

