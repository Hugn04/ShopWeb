require('dotenv').config();
const Product = require('../app/Model/Product');
const Cart = require('../app/Model/Cart');
const Category = require('../app/Model/Category');
const Orders = require('../app/Model/Orders');
const addProductService = async ({ name, preview, photos, description, size, isAccessory, brand, price }) => {
    let product = await Product.create({
        name,
        preview,
        photos,
        description,
        size,
        isAccessory,
        brand,
        price,
    });
    return product;
};
const deleteProductService = async (id) => {
    try {
        const product = await Product.findOne({ _id: id });
        await Cart.deleteMany({ product: product._id });
        await Orders.deleteMany({
            products: {
                $elemMatch: { product: product._id },
            },
        });
        await Product.deleteOne({ _id: id });
    } catch (error) {
        console.error('Lỗi:', error);
    }
};
const deleteCategoryService = async (id) => {
    try {
        await Category.deleteOne({ _id: id });
        const products = await Product.find({ category: id });
        products.forEach((product) => {
            deleteProductService(product._id);
        });
    } catch (error) {
        console.error('Lỗi:', error);
    }
};

module.exports = { addProductService, deleteProductService, deleteCategoryService };
