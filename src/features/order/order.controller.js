import OrderRepository from "./order.repository.js"

export default class OrderController{
    constructor(){
        this.orderRepository = new OrderRepository;
    }

    async placeOrder(req, res, next){
        try{
            const userId = req.userId;
            this.orderRepository.placeOrder(userId);
            res.status(201).send("Order is placed");
        }catch(err){
            console.log(err);
            res.status(500).send("something went wrong in placeOrder controller");
            next(err);
        }
    }
}