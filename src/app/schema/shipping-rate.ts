import mongoose, { Schema } from 'mongoose';

const ShippingRateSchema: Schema = new Schema({
    rate: { type: Number },
    minDistance: { type: Number },
    maxDistance: { type: Number },
    minWeight: { type: Number },
    maxWeight: { type: Number },
    perKgRate: { type: Number },
    halfKgRate: { type: Number },
    localRate: { type: Number },
    area: { type: String },
    shippingMethod: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ShippingRate', ShippingRateSchema);