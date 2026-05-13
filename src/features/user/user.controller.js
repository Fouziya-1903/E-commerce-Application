import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';

export default class UserController{
    signUp(req, res){
        const {name, email, password, type} = req.body;
        const user = UserModel.signUp(name, email, password, type);
        res.status(201).send(user);
    }
    signIn(req, res){
        const{ email, password} = req.body;

        const result = UserModel.signIn(email, password);
        
        if(!result){
            return res.status(400).send("Incorrect credentials");
        }else{
            const token = jwt.sign({userID: result.id, email: result.email}, "mq6FHCEFFN7RD8KW90ZtQyrb", {expiresIn: '1h'});
            return res.status(200).send(token);
        }
    }
}