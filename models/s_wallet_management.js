const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const WalletManagementSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller' },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    reason: { type: String },
    walletAmount: { type: Number },
    existingWalletAmount: { type: Number },
    ipAddress: { type: String },
    isDeleted: { type: Boolean, default: false }
},{ timestamps: true });

const WalletManagements = mongoose.model('wallet_managements', WalletManagementSchema);

module.exports = {
    WalletManagements: WalletManagements,
}
