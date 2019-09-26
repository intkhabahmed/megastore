import mongoose, { Schema } from 'mongoose';

const InvoiceSchema: Schema = new Schema({
    userId: { type: String, required: true },
    file: { type: Blob, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Invoice', InvoiceSchema);