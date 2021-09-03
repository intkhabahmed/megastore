import * as mongoose from 'mongoose';

export const UserSchema: mongoose.Schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    mobile: { type: Number },
    password: { type: String, required: true, select: false },
    isAdmin: { type: Boolean, default: false },
    addresses: [{ type: mongoose.Types.ObjectId, ref: 'Address' }],
    messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
    orders: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

export default mongoose.model('User', UserSchema);
