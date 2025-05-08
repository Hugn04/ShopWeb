const { createUserService, loginUserService } = require('../../services/AccountService');

class UserController {
    async register(req, res) {
        const { name, email, password } = req.body;
        try {
            await createUserService(name, email, password);
            req.flash('success', 'Tạo tài khoản thành công');
            res.redirect('/account');
        } catch (err) {
            req.flash('error', err.message);
            res.redirect('/account');
        }
    }


    async login(req, res) {
        const { email, password } = req.body;
        try {
            const token = await loginUserService(email, password);
            res.setHeader('Set-Cookie', `token=${token}; max-age=36000; httpOnly`);
            req.flash('success', 'Đăng nhập thành công');
            res.redirect('/');
        } catch (err) {
            req.flash('error', 'Đăng nhập thất bại');
            res.redirect('/account');
        }
    }

    logout(req, res) {
        res.clearCookie('token', { httpOnly: true, secure: true, path: '/' });
        res.redirect('/');
    }
    account(req, res) {
       
        
        res.render('pages/login', {layout:false, error: req.flash('error'), success : req.flash('success')})
    }
}
const userController = new UserController();

module.exports = userController;
