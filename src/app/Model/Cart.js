const { default: mongoose } = require('mongoose');

mongoose.set('strictQuery', false);

const Schema = mongoose.Schema;

const CartModel = new Schema({
    amount: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
});
const Cart = mongoose.model('carts', CartModel);
module.exports = Cart;
