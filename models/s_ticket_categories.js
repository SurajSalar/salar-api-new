const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const TicketCategoriesSchema = new Schema({
    subject: { type: String },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
},{ timestamps: true });

const TicketCategories = mongoose.model('ticketCategories', TicketCategoriesSchema);

module.exports = {
    TicketCategories: TicketCategories,
}
