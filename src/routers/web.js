const { Router } = require('express');
const siteController = require('../app/Controllers/SiteController');
const productController = require('../app/Controllers/ProductController');
const userController = require('../app/Controllers/UserController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminController = require('../app/Controllers/AdminController');
const { addProductService } = require('../services/ProductService');
const initData = require('../fakedata.js');
const webRouter = Router();
webRouter.use('*', auth);
webRouter.use('/admin', admin);


webRouter.get('/admin/products', adminController.products)
webRouter.post('/admin/products/:id/edit', adminController.updateProduct)
webRouter.post('/admin/products/:id/delete', adminController.deleteProduct)

webRouter.get('/admin/orders', adminController.orders)
webRouter.get('/admin/customer', adminController.customer)

webRouter.get('/admin/category', adminController.category)
webRouter.post('/admin/category/:id/edit', adminController.updateCategory)
webRouter.post('/admin/category/:id/delete', adminController.deleteCategory)

webRouter.get('/admin/test', adminController.test)
webRouter.get('/admin', adminController.index);

webRouter.post('/register', userController.register);
webRouter.post('/login', userController.login);
webRouter.get('/logout', userController.logout);
webRouter.get('/account', userController.account);

webRouter.get('/cart', productController.cart);
webRouter.post('/cart/buy', productController.buyFromCart);
webRouter.post('/cart/:id/delete', productController.removeCart);


webRouter.post('/product/add-to-cart/:id', productController.addToCart);


webRouter.get('/products', productController.index);


webRouter.get('/product/:id', productController.productDetail);

webRouter.get('/', siteController.index);


webRouter.get('/data', async function (req, res) {
    initData.forEach((item) => {
        addProductService(item);
    });
    return res.json(initData);
});
webRouter.use((req, res, next) => {
    res.render('pages/404page', { layout: false });
});

module.exports = webRouter;
