import * as mongoose from 'mongoose';

const CategorySchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    subCategories: { type: [String] }
})

export default mongoose.model("Category", CategorySchema);
