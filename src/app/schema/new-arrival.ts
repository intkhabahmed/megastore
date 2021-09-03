import * as mongoose from 'mongoose';

const NewArrivalSchema: mongoose.Schema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    name: { type: String }
})

export default mongoose.model("NewArrival", NewArrivalSchema);
