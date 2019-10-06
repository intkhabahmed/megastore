import mongoose, { Schema } from 'mongoose';

const ShippingRateSchema: Schema = new Schema({
    rate: { type: Number },
    minDistance: { type: Number },
    maxDistance: { type: Number },
    minWeight: { type: Number },
    maxWeight: { type: Number },
    perKgRate: { type: Number },
    halfKgRate: { type: Number },
    isLocal: { type: Boolean },
    area: { type: String },
    shippingMethod: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ShippingRate', ShippingRateSchema);