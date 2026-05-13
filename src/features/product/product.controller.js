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

    getOneProduct(req, res){
        const id = Number(req.params.id);
        const product = ProductModel.get(id);
        if(product){
            res.status(200).send(product);
        }else{
            res.status(404).send("Product not found");
        }
    };

    filterProduct(req, res){
        const {minPrice, maxPrice, category} = req.query;
        const result = ProductModel.filter(minPrice,maxPrice,category);

        return res.status(200).send(result);
    };

    rateProduct(req, res){
        const {userId, productId, ratings} = req.query;
        const error = ProductModel.rateProduct(
            userId,
            productId,
            ratings
        );
        if(error){
            return res.status(401).send(error);
        }else{
            return res.status(200).send("Successfully rated the product");
        }
    }
}