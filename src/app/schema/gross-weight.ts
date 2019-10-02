import mongoose, { Schema } from 'mongoose';

const GrossWeightSchema: Schema = new Schema({
    minWeight: { type: Number, required: true },
    maxWeight: { type: Number, required: true },
    toBeAdded: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('GrossWeight', GrossWeightSchema);