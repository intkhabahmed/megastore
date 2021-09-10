import * as mongoose from 'mongoose';

const LongDescriptionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    value: { type: String, required: true },
})

const PriceBatchSchema = new mongoose.Schema({
    unit: { type: String, required: true },
    minQuantity: { type: Number, required: true },
    maxQuantity: { type: Number },
    discountPercentage: { type: Number, required: true },
})

const BunchSchema = new mongoose.Schema({
    bunchPerPacket: { type: Number, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
})

const ProductSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    productCode: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: [LongDescriptionSchema], required: true },
    imageUrl: { type: [String], required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    unitType: { type: Number, required: true },
    productStatus: { type: Boolean, default: true },
    priceBatches: { type: [PriceBatchSchema] },
    bunchInfo: { type: BunchSchema },
    price: { type: [[Number]], required: true },
    quantity: { type: [[Number]], required: true },
    colors: { type: [String], required: true },
    weight: { type: [[Number]] },
    size: { type: [[String]], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
}, { strict: false });

ProductSchema.index({ '$**': 'text' });

export default mongoose.model('Product', ProductSchema);
