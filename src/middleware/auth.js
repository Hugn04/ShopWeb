require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../app/Model/User');
const Cart = require('../app/Model/Cart');

const auth = async (req, res, next) => {
    //const white_list = ['/', '/login', '/register'];
    const token = req.cookies.token;
    const white_list = ['/', '/login', '/register', '/logout', '/account', '/products'];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id }).select('_id name avatar email role');
        res.locals.user = user;
        const cartCount = await Cart.countDocuments({ user: user._id });
        res.locals.cartCount = cartCount;

        next();
    } catch (error) {
        res.locals.user = null;
        res.locals.cartCount = 0;
        if (white_list.includes(req.originalUrl)) {
            next();
        } else {
            req.flash('error', 'Bạn phải đăng nhập mới vào được trang này !');
            res.redirect('/account');
        }
    }
};
module.exports = auth;
