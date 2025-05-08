const { default: mongoose } = require('mongoose');

mongoose.set('strictQuery', false);

const Schema = mongoose.Schema;

const UserModel = new Schema({
    name: String,
    password: String,
    email: String,
    avatar: { type: String, default: 'https://th.bing.com/th/id/OIP.aO8TdF2XjkoCqX7jxYBh7AHaHa?rs=1&pid=ImgDetMain' },
    role: String,
    address: String,
    phone: String,
});
const User = mongoose.model('users', UserModel);
module.exports = User;
