import mongoose, { Schema } from 'mongoose'

const BannerSchema: Schema = new Schema({
    imageUrl: { type: String, required: true },
    title: { type: String },
    subTitle: { type: String },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Banner", BannerSchema)