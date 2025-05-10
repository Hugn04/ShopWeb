const { default: mongoose } = require('mongoose');

mongoose.set('strictQuery', false);

const Schema = mongoose.Schema;

const CartModel = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' , require},
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', require },
});
const Cart = mongoose.model('carts', CartModel);
module.exports = Cart;
