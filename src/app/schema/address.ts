import mongoose, { Schema } from 'mongoose';

export const AddressSchema: Schema = new Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
});

export default mongoose.model('Address', AddressSchema);