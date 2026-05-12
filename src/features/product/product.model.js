export default class ProductModel{
    constructor(id, name, desc, price, imageUrl, category, size){
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.size = size;
    }

    static getAll(){
        return products;
    }

    static add(product){
        product.id = products.length + 1;
        products.push(product);
        return products;
    }
}

const products = [
    new ProductModel(
        1,
        "iPhone 15",
        "Latest Apple smartphone with A16 chip",
        79999,
        "https://www.google.com/imgres?q=iphone%2015&imgurl=https%3A%2F%2Fwww.imagineonline.store%2Fcdn%2Fshop%2Ffiles%2FiPhone_15_Blue_PDP_Image_Position-1_alt__en-IN_d242440d-a718-4536-a369-b6dccf9b636e.jpg%3Fv%3D1759733978%26width%3D1445&imgrefurl=https%3A%2F%2Fwww.imagineonline.store%2Fproducts%2Fiphone-15-mtp93hn-a%3Fsrsltid%3DAfmBOor2gN-sMb4q16okqOSLn8dpFyLgfkosMrvLFWzlZC6bjhOU6KNZ&docid=DcphcN264atRqM&tbnid=Rb5-IR38_nbZFM&vet=12ahUKEwjojKjpzrOUAxWdbmwGHRydAssQnPAOegQIUBAB..i&w=1445&h=1445&hcb=2&ved=2ahUKEwjojKjpzrOUAxWdbmwGHRydAssQnPAOegQIUBAB",
        "Mobile",
        "128GB"
    ),

    new ProductModel(
        2,
        "Samsung Galaxy S24",
        "Flagship Samsung Android phone",
        74999,
        "https://www.google.com/imgres?q=samsung%20galaxy%20s24&imgurl=https%3A%2F%2Fwww.triveniworld.com%2Fcdn%2Fshop%2Ffiles%2Fsamsung-galaxy-s24-ultra-5g-ai-smartphone-titanium-violet-12gb-256gb-storage-triveni-world-1.jpg%3Fv%3D1736304707%26width%3D1946&imgrefurl=https%3A%2F%2Fwww.triveniworld.com%2Fproducts%2Fsamsung-galaxy-s24-ultra-5g-ai-smartphone-titanium-violet-12gb-256gb-storage%3Fsrsltid%3DAfmBOopfzT5bkDucOcYkVyKCE7qb__MKrWT08Fes-fSVk7fMHlKffK0Y&docid=CWJEmlkup42yWM&tbnid=CapPbFZlecJoYM&vet=12ahUKEwjAl7eAz7OUAxV1TWwGHTGBC7EQnPAOegQIGhAB..i&w=1946&h=1946&hcb=2&ved=2ahUKEwjAl7eAz7OUAxV1TWwGHTGBC7EQnPAOegQIGhAB",
        "Mobile",
        "256GB"
    ),

    new ProductModel(
        3,
        "Nike Air Max",
        "Comfortable running shoes",
        5999,
        "https://www.google.com/imgres?q=nike%20air%20max&imgurl=https%3A%2F%2Fwww.mytheresa.com%2Fimage%2F1094%2F1238%2F100%2F1f%2FP00948248.jpg&imgrefurl=https%3A%2F%2Fwww.mytheresa.com%2Fde%2Fen%2Fwomen%2Fnike-nike-air-max-90-leather-sneakers-grey-p00948248&docid=txXg9tdRY13i7M&tbnid=sIG64UzThSDCkM&vet=12ahUKEwjO74mPz7OUAxWta2wGHfc7EYsQnPAOegQIbhAB..i&w=1094&h=1237&hcb=2&ved=2ahUKEwjO74mPz7OUAxWta2wGHfc7EYsQnPAOegQIbhAB",
        "Footwear",
        ["UK-8", "UK-9"]
    ),

    new ProductModel(
        4,
        "HP Pavilion Laptop",
        "Powerful laptop for coding and gaming",
        68999,
        "https://www.google.com/imgres?q=hp%20pavilion%20la&imgurl=https%3A%2F%2Fwww.hp.com%2Fcontent%2Fdam%2Fsites%2Fworldwide%2Flaptops-and-2-in-1s%2Fpavilion%2FHP%2520Pavilion%2520laptops%2520-%2520Desktop%402x.png&imgrefurl=https%3A%2F%2Fwww.hp.com%2Fus-en%2Fshop%2Fslp%2Fhp-pavilion%2Flaptops&docid=eYqtJcxKX-xGCM&tbnid=PmIRrYvk9ZBQuM&vet=12ahUKEwjv58igz7OUAxX3VmwGHUooKwYQnPAOegQIFxAB..i&w=812&h=608&hcb=2&ved=2ahUKEwjv58igz7OUAxX3VmwGHUooKwYQnPAOegQIFxAB",
        "Electronics",
        "15-inch"
    ),

    new ProductModel(
        5,
        "Boat Rockerz 550",
        "Wireless Bluetooth headphones",
        1999,
        "https://www.google.com/imgres?q=boat%20rockerz%20550&imgurl=https%3A%2F%2Fcdn.lotuselectronics.com%2Fwebpimages%2F478411IM.webp&imgrefurl=https%3A%2F%2Fwww.lotuselectronics.com%2Fproduct%2Fheadphones%2Fboat-wireless-over-ear-phone-rockerz-550-black%2F34871%3Fsrsltid%3DAfmBOoqNIYJith_fYRA8MD_4v6lL1HJC878HRMgtFNrOxDW519-pFNXA&docid=Ppb5u76Vjnb2zM&tbnid=kCtefSzdpjJFuM&vet=12ahUKEwjGjaWsz7OUAxUlWGwGHf2PIJIQnPAOegQIIxAB..i&w=450&h=450&hcb=2&ved=2ahUKEwjGjaWsz7OUAxUlWGwGHf2PIJIQnPAOegQIIxAB",
        "Accessories",
        "Standard"
    )
];