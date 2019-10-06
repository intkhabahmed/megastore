import mongoose, { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number },
    password: { type: String, required: true },
    token: { type: String },
    addresses: [{ type: mongoose.Schema.ObjectId, ref: 'Address' }],
    messages: [{ type: mongoose.Schema.ObjectId, ref: 'Message' }],
    orders: [{ type: mongoose.Schema.ObjectId, ref: 'Order' }],
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

export default mongoose.model('User', UserSchema);