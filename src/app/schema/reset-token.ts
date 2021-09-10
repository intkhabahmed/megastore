import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ResetTokenSchema = new Schema({
    userId: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 }
});

export default mongoose.model('ResetToken', ResetTokenSchema);
