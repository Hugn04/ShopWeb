require('dotenv').config();
const Product = require('../app/Model/Product');
const Cart = require('../app/Model/Cart');
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
        await Product.deleteOne({ _id: id });
    } catch (error) {
        console.error('Lỗi:', error);
    }
};
const updateProductService = async ({ slug, title, price, description, image, amount }) => {
    let product = await Product.findOneAndUpdate(
        { slug: slug },
        {
            title: title,
            price: price,
            description: description,
            image: image,
            amount: amount,
        },
    );
    return product;
};

const buyProductService = async (slug, number) => {
    const product = await Product.findOne({ slug: slug });
    if (product.amount > 0 && product.amount - number >= 0) {
        await Product.updateOne(
            { slug: slug },
            {
                $inc: {
                    amount: -number,
                    sold: number,
                },
            },
        );
    } else {
        throw new Error(`Sản phẩm ${product.title} đã hết hàng vui lòng quay lại sau !`);
    }
};

module.exports = { addProductService, deleteProductService, updateProductService, buyProductService };
