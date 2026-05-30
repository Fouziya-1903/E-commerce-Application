import OrderRepository from "./order.repository.js"

export default class OrderController{
    constructor(){
        this.orderRepository = new OrderRepository;
    }

    async placeOrder(req, res, next){
        try{
            const userId = req.userId;
            const newOrderPayload = await this.orderRepository.placeOrder(userId);
            res.status(201).send(newOrderPayload);
        }catch(err){
            console.log("Error trapped securely inside OrderController:", err.message);
            next(err);
        }
    }
}