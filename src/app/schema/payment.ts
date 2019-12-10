import mongoose, { Schema } from 'mongoose';

export const PaymentSchema: Schema = new Schema({
    orderId: { type: String, required: true },
    trackingId: { type: String, required: true },
    bankRefNo: { type: String, required: true },
    orderStatus: { type: String, required: true },
    failureMessage: { type: String, required: true },
    paymentMode: { type: String, required: true },
    cardName: { type: String, required: true },
    statusCode: { type: String, required: true },
    statusMessage: { type: String, required: true },
    amount: { type: String, required: true },
    transDate: { type: Date, required: true }
})

export default mongoose.model('Payments', PaymentSchema)