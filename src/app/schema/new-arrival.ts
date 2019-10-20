import mongoose, { Schema } from 'mongoose';

const NewArrivalSchema: Schema = new Schema({
    imageUrl: { type: String, required: true },
    name: { type: String }
})

export default mongoose.model("NewArrival", NewArrivalSchema);