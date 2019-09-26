import mongoose, { Schema } from 'mongoose';

const MessageSchema: Schema = new Schema({
    from: { type: String, required: true },
    message: { type: String, required: true },
    reply: { type: String },
    sentAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', MessageSchema);