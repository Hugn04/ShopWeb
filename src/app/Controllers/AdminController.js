const { addProductService, deleteProductService, updateProductService } = require('../../services/ProductService');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
const Category = require('../Model/Category');

const Product = require('../Model/Product');
const User = require('../Model/User');

class AdminController {
    async index(req, res) {
        try {
            const customerCount = await User.countDocuments();
            const productCount = await Product.countDocuments();
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
        try {
            const products = await Product.find();
            const categorys = await Category.find();
            res.render('admin/products', {
                layout: 'layouts/admin',
                products,
                categorys,
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
    orders(req, res) {
        res.render('admin/orders', {
            layout: 'layouts/admin',
            title: 'Admin Orders',
            error: req.flash('error'),
            success: req.flash('success'),
        });
    }
    customer(req, res) {
        res.render('admin/customer', {
            layout: 'layouts/admin',
            title: 'Admin Customer',
            error: req.flash('error'),
            success: req.flash('success'),
        });
    }
    async category(req, res) {
        try {
            const categorys = await Category.find();
            res.render('admin/category', {
                layout: 'layouts/admin',
                categorys,
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
    async addProduct(req, res) {
        try {
            const data = req.body;
            addProductService(data);
            req.session.error = 'Thêm sản phẩm thành công !';
            res.redirect('/admin');
        } catch (error) {
            console.log(error);

            res.redirect('/admin');
        }
    }

    async edit(req, res) {
        const product = await Product.findOne({ slug: req.params.slug });
        res.render('admin/edit', {
            product: mongooseToObject(product),
        });
    }
    async editProduct(req, res) {
        try {
            const data = req.body;
            const slug = req.params.slug;
            await updateProductService({ slug, ...data });
            req.session.error = 'Sửa sản phẩm thành công !';
            res.redirect('/admin');
        } catch (error) {
            console.log(error);

            req.session.error = 'Sửa sản phẩm thất bại !';
            res.redirect('/admin');
        }
    }
    async deleteProduct(req, res) {
        try {
            const slug = req.params.slug;
            await deleteProductService(slug);
            req.session.error = 'Xóa sản phẩm thành công !';
            res.redirect('/admin');
        } catch (error) {
            console.log(error);

            req.session.error = 'Xóa sản phẩm thất bại !';
            res.redirect('/admin');
        }
    }
}
const adminController = new AdminController();

module.exports = adminController;
