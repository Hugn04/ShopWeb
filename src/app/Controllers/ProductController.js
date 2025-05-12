const formatVND = require('../../util/formatVND');
const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose');
const Cart = require('../Model/Cart');
const Product = require('../Model/Product');
const Orders = require('../Model/Orders');
const Category = require('../Model/Category');
const sortProducts = require('../../util/sortProduct');

class ProductController {
    async index(req, res) {
        const query = req.query;
        let filter = {};
        let sort = {};
        if (query.category) {
            filter = { ...filter, category: query.category };
        }
        if(query.search){
            filter = {name: { $regex: query.search, $options: 'i' }}
        }
        if (query.sort) {
            const sortType = query.sort;
            if (sortType == 'price-asc') {
                sort = { ...sort, price: 1 };
            }
            if (sortType == 'price-desc') {
                sort = { ...sort, price: -1 };
            }
            if (sortType == 'name-asc') {
                sort = { ...sort, name: 1 };
            }
            if (sortType == 'name-desc') {
                sort = { ...sort, name: -1 };
            }
        }
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const limit = 10; // Số sản phẩm mỗi trang
        const skip = (page - 1) * limit;

        try {
            const rawProducts = await Product.find(filter).limit(limit).skip(skip).populate('category', 'name');
            const products = sortProducts(rawProducts, sort);
            const categorys = await Category.find();
            const countProduct = await Product.countDocuments();
            const totalProducts = await Product.countDocuments(filter);
            const categoryWithCount = await Promise.all(
                categorys.map(async (category) => {
                    const count = await Product.countDocuments({ category: category._id });
                    return {
                        ...category.toObject(),
                        count,
                    };
                }),
            );
            const totalPages = Math.ceil(totalProducts / limit);

            // Render ra view
            res.render('pages/products', {
                products,
                skip,
                page,
                totalProducts,
                countProduct,
                categorys: categoryWithCount,
                formatVND,
                totalPages,
                error: req.flash('error'),
                success: req.flash('success'),
            });
        } catch (error) {
            console.log(error);
        }
    }

    async addToCart(req, res) {
        const proID = req.params.id;
        const userID = res.locals.user._id;
        try {
            const existingCart = await Cart.findOne({ user: userID, product: proID });

            if (existingCart) {
                req.flash('error', 'Sản phẩm này đã có trong giỏ hàng rồi');
            } else {
                await Cart.create({ user: userID, product: proID });
                req.flash('success', 'Sản phẩm đã được thêm vào giỏ hàng');
            }

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

    async buyFromCart(req, res) {
        const data = req.body;
        const products = JSON.parse(data.items);
        
        try {
            await Orders.create({...data, products});
            products.forEach(async (item) => {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: {
                        sold: item.quantity,
                        amount: -item.quantity,
                    },
                });
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
