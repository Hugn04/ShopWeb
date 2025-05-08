require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../app/Model/User');

const auth = async (req, res, next) => {
    //const white_list = ['/', '/login', '/register'];
    const token = req.cookies.token;
    const white_list = ['/', '/login', '/register', '/logout', '/account', '/products'];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id:decoded.id})
        res.locals.user = user;
        next();
    } catch (error) {
        res.locals.user = null;
        if (white_list.includes(req.originalUrl)) {
            res.locals.cart = { length: 0 };
            
            next();
        } else {    
            req.flash('error', "Bạn phải đăng nhập mới vào được trang này !");
            res.redirect('/account');
        }
    }
};
module.exports = auth;
