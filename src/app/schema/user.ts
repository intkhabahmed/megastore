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
    orders: { type: String },
    wishlist: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);