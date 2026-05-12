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
        // const minPrice = req.query.minPrice;
        // const maxPrice = req.query.maxPrice;
        // const category = req.query.category;
        
        const {minPrice, maxPrice, category} = req.query;
        console.log("Query Params:", { minPrice, maxPrice, category });

        const result = ProductModel.filter(minPrice,maxPrice,category);

        return res.status(200).send(result);
    };
}