import ProductModel from "./product.model.js";
export default class ProductController{
    getAllProducts(req, res){
        const products = ProductModel.getAll();
        res.status(200).send(products);
    };

    addProduct(req, res){
        const {name, price, size} = req.body;
        const newProduct = {
            name,
            price: parseFloat(price),
            size: size.split(','),
            imageUrl : req.file.filename,
        }
        const productAdded = ProductModel.add(newProduct);
        res.status(201).send(productAdded);
    };

    // rateProduct(req, res){

    // };

    // getOneProduct(req, res){

    // };

    // filterProduct(req, res){

    // };
}