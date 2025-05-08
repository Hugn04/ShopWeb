const multipleMongooseToObject = (mongoose) => {
    return mongoose.map((mongoose) => mongoose.toObject());
};
const mongooseToObject = (mongoose) => {
    return mongoose ? mongoose.toObject() : mongoose;
};
module.exports = { multipleMongooseToObject, mongooseToObject };
