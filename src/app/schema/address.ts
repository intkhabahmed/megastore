import * as mongoose from 'mongoose';

export const AddressSchema: mongoose.Schema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
});

export default mongoose.model('Address', AddressSchema);
