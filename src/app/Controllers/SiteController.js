const formatVND = require('../../util/formatVND');
const Product = require('../Model/Product');

class SiteController {
    async index(req, res) {
        try {
            const hotProducts = await Product.find({ isAccessory: true })
                .sort({ sold: -1 }) // Sắp xếp theo số lượng bán giảm dần
                .limit(5)
                .populate('category', 'name');
            const newProducts = await Product.find({ isAccessory: false })
                .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo giảm dần (mới nhất trước)
                .limit(5)
                .populate('category', 'name');

            res.render('pages/content', {
                hotProducts,
                newProducts,
                formatVND,
                error: req.flash('error'),
                success: req.flash('success'),
            });
        } catch (error) {
            console.log(error);
        }
    }
}
const siteController = new SiteController();

module.exports = siteController;
