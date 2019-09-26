import mongoose, { Schema } from 'mongoose';

const OrderSchema: Schema = new Schema({
    userId: { type: String, required: true },
    orderSummary: { type: String, required: true },
    orderStatus: { type: String, required: true },
    trackingDetails: { type: String },
    invoiceId: { type: String, required: true },
    payment: { type: String, default: true },
    orderDate: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);