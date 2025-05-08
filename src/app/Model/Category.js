const { default: mongoose } = require('mongoose');

mongoose.set('strictQuery', false);

const Schema = mongoose.Schema;

const CategoryModel = new Schema({
    name: String,
    description: String,
});
const Category = mongoose.model('categories', CategoryModel);
module.exports = Category;
