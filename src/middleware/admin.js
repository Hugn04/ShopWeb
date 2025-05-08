require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../app/Model/User');

const  admin = async (req, res, next) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id:decoded.id})
        if (user.role === 'admin') {
            next();
        } else {
            req.flash('error', "Bạn không phải là admin !");
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        
        req.flash('error', "Bạn phải đăng nhập mới vào được trang này !");
        res.redirect('/');
    }
};
module.exports = admin;
