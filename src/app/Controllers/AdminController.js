const { addProductService, deleteProductService, updateProductService } = require('../../services/ProductService');
const formatDate = require('../../util/formatDate');
const formatVND = require('../../util/formatVND');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
const Category = require('../Model/Category');
const Orders = require('../Model/Orders');

const Product = require('../Model/Product');
const User = require('../Model/User');

class AdminController {
    async index(req, res) {
        try {
            const customerCount = await User.countDocuments({ role: 'user' });
            const productCount = await Product.countDocuments();
            const orderCount = await Orders.countDocuments();
            const result = await Product.aggregate([
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryInfo',
                    },
                },
                { $unwind: '$categoryInfo' },
                {
                    $group: {
                        _id: '$categoryInfo.name', // Nhóm theo tên danh mục
                        totalSold: { $sum: '$sold' }, // Cộng trường `sold`
                    },
                },
            ]);

            const chart = [result.map((item) => item._id), result.map((item) => item.totalSold)];

            res.render('admin/dashboard', {
                layout: 'layouts/admin',
                title: 'Admin Dashbroard',
                productCount,
                customerCount,
                orderCount,
                chart,
                error: req.flash('error'),
                success: req.flash('success'),
            });
        } catch (error) {
            console.log(error);

            res.render('admin/dashboard', { layout: 'admin' });
        }
    }
    async products(req, res) {
        const query = req.query;
        let filter = {};
        if (query.category) {
            filter = { ...filter, category: query.category };
        }

        try {
            const products = await Product.find(filter);
            const categorys = await Category.find();
            res.render('admin/products', {
                layout: 'layouts/admin',
                products,
                categorys,
                formatVND,
                title: 'Admin Products',
                error: req.flash('error'),
                success: req.flash('success'),
            });
        } catch (error) {
            res.render('admin/products', {
                layout: 'layouts/admin',
                error: req.flash('error'),
                success: req.flash('success'),
            });
        }
    }
    // Product
    async updateProduct(req, res) {
        const data = req.body;
        const photos = JSON.parse(data.photos);
        const value = { ...data, photos, preview: photos[0] };
        const id = req.params.id;
        try {
            if (id === 'new') {
                await Product.create(value);
                req.flash('success', 'Thêm sản phẩm thành công !');
            } else {
                const result = await Product.findOneAndUpdate(
                    { _id: id },
                    value, // dữ liệu cập nhật
                    { upsert: true, new: true }, // nếu không có thì tạo, trả về bản ghi mới
                );
                req.flash('success', 'Sửa sản phẩm thành công !');
            }

            return res.redirect('/admin/products');
        } catch (error) {
            console.log(error);

            res.redirect('/admin/products');
        }

        res.render('admin/orders', {
            layout: 'layouts/admin',
            title: 'Admin Orders',
            error: req.flash('error'),
            success: req.flash('success'),
        });
    }
    async deleteProduct(req, res) {
        try {
            const slug = req.params.id;
            await deleteProductService(slug);
            req.flash('success', 'Xóa sản phẩm thành công !');
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error);
            req.flash('success', 'Xóa sản phẩm thất bại !');
            res.redirect('/admin/products');
        }
    }
    async orders(req, res) {
        try {
            const orders = await Orders.find();
            res.render('admin/orders', {
                layout: 'layouts/admin',
                orders,
                formatVND,
                formatDate,
                title: 'Admin Orders',
                error: req.flash('error'),
                success: req.flash('success'),
            });
        } catch (error) {}
    }
    async customer(req, res) {
        try {
            const customers = await User.find({ role: 'user' });
            console.log(customers);

            res.render('admin/customer', {
                layout: 'layouts/admin',
                title: 'Admin Customer',
                customers,
                error: req.flash('error'),
                success: req.flash('success'),
            });
        } catch (error) {
            res.render('admin/customer', {
                layout: 'layouts/admin',
                title: 'Admin Customer',
                error: req.flash('error'),
                success: req.flash('success'),
            });
        }
    }
    async category(req, res) {
        try {
            const categorys = await Category.find();

            const categoryWithCount = await Promise.all(
                categorys.map(async (category) => {
                    const count = await Product.countDocuments({ category: category._id });
                    return {
                        ...category.toObject(),
                        count,
                    };
                }),
            );
            res.render('admin/category', {
                layout: 'layouts/admin',
                categorys:categoryWithCount,
                title: 'Admin Category',
                error: req.flash('error'),
                success: req.flash('success'),
            });
        } catch (error) {
            res.render('admin/category', {
                layout: 'layouts/admin',
                title: 'Admin Category',
                error: req.flash('error'),
                success: req.flash('success'),
            });
        }
    }
    async updateCategory(req, res) {
        const { name, description } = req.body;
        const id = req.params.id;
        try {
            if (id === 'new') {
                await Category.create({ name, description });
                req.flash('success', 'Thêm danh mục thành công !');
            } else {
                const result = await Category.findOneAndUpdate(
                    { _id: req.params.id },
                    { name, description }, // dữ liệu cập nhật
                    { upsert: true, new: true }, // nếu không có thì tạo, trả về bản ghi mới
                );
                req.flash('success', 'Sửa danh mục thành công !');
            }

            res.redirect('/admin/category');
        } catch (error) {
            console.log(error);

            res.redirect('/admin/category');
        }
    }

    async deleteCategory(req, res) {
        const id = req.params.id;
        try {
            await Category.deleteOne({ _id: id });
            req.flash('error', 'Xóa danh mục thành công !');
            res.redirect('/admin/category');
        } catch (error) {
            res.redirect('/admin/category');
        }
    }

    test(req, res) {
        res.render('admin/index', {
            layout: false,
            error: req.flash('error'),
            success: req.flash('success'),
        });
    }
}
const adminController = new AdminController();

module.exports = adminController;
