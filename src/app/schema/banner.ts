import * as mongoose from 'mongoose'

const BannerSchema: mongoose.Schema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String },
    subTitle: { type: String },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Banner", BannerSchema)
