import mongoose, { Schema } from 'mongoose';

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    productCode: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    productStatus: { type: Boolean, default: true },
    quantity: { type: Number, required: true },
    availableColor: { type: String },
    weight: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default mongoose.model('Product', ProductSchema);