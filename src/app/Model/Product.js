const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const Schema = mongoose.Schema;

// Tạo schema cho ProductModel
const ProductModel = new Schema({
    name: { type: String, required: true },
    preview: String,
    photos: [String],
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    amount: { type: Number, default: 0 },
    price: { type: Number, required: true },
    sold: { type: Number, default: 0 },
});
// Tạo model và export
const Product = mongoose.model('products', ProductModel);
module.exports = Product;
