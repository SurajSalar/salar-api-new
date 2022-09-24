const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const TicketSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller' },
    message: { type: String },
    role: { type: String, enum : ['user','admin', 'seller']},
    isDeleted: { type: Boolean, default: false }
},{ timestamps: true });

const Tickets = mongoose.model('supportTickets', TicketSchema);

module.exports = {
    Tickets: Tickets,
}
