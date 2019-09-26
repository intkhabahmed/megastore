import mongoose, { Schema } from 'mongoose';

const ShippingRateSchema: Schema = new Schema({
    ratePerKm: { type: String, required: true },
    shippingMethod: { type: String, required: true }
});

export default mongoose.model('ShippingRate', ShippingRateSchema);