import mongoose, { Schema } from 'mongoose';

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    productCode: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: [String], required: true },
    category: { type: String, required: true },
    subCategory: { type: String},
    productStatus: { type: Boolean, default: true },
    price: { type: [[Number]], required: true },
    quantity: { type: [[Number]], required: true },
    colors: { type: [String], required: true },
    weight: { type: [[Number]], required: true },
    size: { type: [[String]], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
}, { strict: false });

ProductSchema.index({ '$**': 'text' });

export default mongoose.model('Product', ProductSchema);