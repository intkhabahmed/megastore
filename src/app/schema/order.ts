import mongoose, { Schema } from 'mongoose';

const OrderSchema: Schema = new Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    orderNo: { type: String, required: true },
    orderSummary: { type: String, required: true },
    orderStatus: { type: Number, required: true },
    trackingNo: { type: String },
    invoiceId: { type: String, required: true },
    payment: { type: mongoose.Schema.ObjectId, ref: 'Payments' },
    address: { type: String, required: true },
    orderDate: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);