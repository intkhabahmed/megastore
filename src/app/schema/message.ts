import * as mongoose from 'mongoose';

const MessageSchema: mongoose.Schema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    reply: { type: String },
    sentAt: { type: Date, default: Date.now }
}, { strict: false });

export default mongoose.model('Message', MessageSchema);
