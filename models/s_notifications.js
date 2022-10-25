const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const NotificationsSchema = new Schema({
    notificationNo: { type: String },
    title: { type: String },
    type: { type: String, enum:["User", "Seller", "Staff", "All"] },
    file: { type: String },
    message: { type: String },
    isDeleted: { type: Boolean, default: false},
    isPublished: { type: Boolean, default: false},
    publishedDate: {type: Date},
    sellerIds: [{type: Schema.Types.ObjectId, ref: 'Seller'}],
    userIds: [{type: Schema.Types.ObjectId, ref: 'Users'}],
    adminIds: [{type: Schema.Types.ObjectId, ref: 'Admin'}],
    viewedSellerIds: [{type: Schema.Types.ObjectId, ref: 'Seller'}],
    viewedUserIds: [{type: Schema.Types.ObjectId, ref: 'Users'}],
    viewedAdminIds: [{type: Schema.Types.ObjectId, ref: 'Admin'}],
},
    { timestamps: true });

const Notifications = mongoose.model('notifications', NotificationsSchema);

module.exports = {
    Notifications: Notifications,
}

