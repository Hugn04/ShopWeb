const { buyProductService } = require('../../services/ProductService');
const formatVND = require('../../util/formatVND');
const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose');
const Cart = require('../Model/Cart');
const Product = require('../Model/Product');
const Orders = require('../Model/Orders');

class ProductController {
    async index(req, res) {
        try {
            const slug = req.params.slug;
            const { type, sort } = req.query; // Lấy tham số từ query

            // Tạo bộ lọc và sắp xếp
            let filter = {};
            let sortOrder = {};

            // Lọc theo type nếu có
            if (type) {
                if (type === 'price') {
                    filter.price = { $exists: true };
                } else if (type === 'speed') {
                    filter.sold = { $exists: true };
                } else if (type === 'name') {
                    filter.title = { $exists: true };
                }
            }

            // Sắp xếp theo sort nếu có
            if (sort) {
                const order = sort === 'asc' ? 1 : -1;
                if (type === 'price') {
                    sortOrder.price = order;
                } else if (type === 'speed') {
                    sortOrder.sold = order;
                } else if (type === 'name') {
                    sortOrder.title = order;
                }
            }

            // Lấy danh sách sản phẩm theo bộ lọc và sắp xếp
            const products = await Product.find(filter).sort(sortOrder);

            // Lấy lỗi từ session nếu có
            const error = req.session.error;
            req.session.error = null;

            // Render ra view
            res.render('product', {
                error: error,
                product: multipleMongooseToObject(products),
                slug: slug,
            });
        } catch (error) {
            console.log(error);

            // Render lại trang với lỗi
            res.render('product', { error });
        }
    }

    async addToCart(req, res) {
        const proID = req.params.id;
        const userID = res.locals.user._id;
        try {
            await Cart.create({ user: userID, product: proID });

            res.redirect(`/product/${proID}`);
        } catch (error) {
            console.log(error);

            res.redirect('/');
        }
    }
    async cart(req, res) {
        const userID = res.locals.user._id;
        try {
            const carts = await Cart.find({ user: userID }).populate('product', 'name price preview amount');
            res.render('pages/cart2', { carts, formatVND, error: req.flash('error'), success: req.flash('success') });
        } catch (error) {}
    }
    async buy(req, res) {
        const slug = req.params.slug;
        try {
            await buyProductService(slug, req.body.amount);
            req.session.error = 'Bạn đã mua sản phẩm thành công !';
            res.redirect(`/${slug}`);
        } catch (error) {
            req.session.error = error.message;
            res.redirect(`/${slug}`);
        }
    }

    async buyFromCart(req, res) {
        const data = req.body;
        const items = JSON.parse(data.items);

        try {
            items.forEach(async (item) => {
                const newData = { ...data, ...item };

                await Product.findByIdAndUpdate(item.product, {
                    $inc: {
                        sold: item.quantity,
                        amount: -item.quantity,
                    },
                });

                await Orders.create(newData);
            });
            req.flash('success', 'Mua sản phẩm thành công');
            res.redirect(`/cart`);
        } catch (error) {
            req.flash('error', error.message);
            res.redirect(`/cart`);
        }
    }
    async removeCart(req, res) {
        const id = req.params.id;
        try {
            await Cart.deleteOne({ _id: id });
            req.flash('success', 'Đã xóa sản phẩm khỏi giỏ hàng');
            res.redirect(`/cart`);
        } catch (error) {
            req.flash('error', error);
            res.redirect(`/cart`);
        }
    }
    async productDetail(req, res) {
        const id = req.params.id;
        try {
            const product = await Product.findOne({ _id: id });
            const similars = await Product.find({
                category: product.category,
                _id: { $ne: product._id }, 
            })
                .populate('category', 'name')
                .limit(5);

            res.render('pages/contentDetails', {
                product,
                similars,
                formatVND,
                error: req.flash('error'),
                success: req.flash('success'),
            });
        } catch (error) {}
    }
}
const productController = new ProductController();

module.exports = productController;
