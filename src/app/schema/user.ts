import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number },
    password: { type: String, required: true },
    token: { type: String },
    shippingAddress: { type: String },
    billingAddress: { type: String },
    messageIds: { type: [String] },
    orderIds: { type: [String] },
    wishedProductIds: { type: [String] },
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

export default mongoose.model('User', UserSchema);