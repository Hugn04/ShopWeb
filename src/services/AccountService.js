require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../app/Model/User');
const saltRounds = 10;
const createUserService = async (name, email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Tài khoản này có người đăng ký rồi !');
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    let user = await User.create({
        email: email,
        password: hashPassword,
        role: 'user',
        name: name,
    });

    return user;
};
const loginUserService = async (email, password) => {
    const user = await User.findOne({ email });
    if (user) {
        const isMathPassword = await bcrypt.compare(password, user.password);

        if (!isMathPassword) {
            throw new Error('Tên tài khoản hoặc mật khẩu không chính xác !');
        } else {
            const payload = {
                id: user.id,
                role: user.role,
            };
            const asset_token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });
            return asset_token;
        }
    } else {
        throw new Error('Tên tài khoản hoặc mật khẩu không chính xác !');
    }
};

module.exports = { createUserService, loginUserService };
