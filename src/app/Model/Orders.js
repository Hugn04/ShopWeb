const { default: mongoose } = require('mongoose');

mongoose.set('strictQuery', false);

const Schema = mongoose.Schema;

const OrdersModel = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    createdAt: { type: Date, default: Date.now },
    price: Number,
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'bank'],
        default: 'cod',
    },
});
const Orders = mongoose.model('orders', OrdersModel);
module.exports = Orders;
