import mongoose, { Schema } from 'mongoose';

const MessageSchema: Schema = new Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    reply: { type: String },
    sentAt: { type: Date, default: Date.now }
}, { strict: false });

export default mongoose.model('Message', MessageSchema);