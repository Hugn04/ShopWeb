const Product = require('../Model/Product');

class SiteController {
    async index(req, res) {
        try {
            const accessory = await Product.find({ isAccessory: true });
            const notAccessory = await Product.find({ isAccessory: false }).populate('category', 'name');
            
            
            res.render('pages/content', {
                accessory,
                notAccessory,
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
