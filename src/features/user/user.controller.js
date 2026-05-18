import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";

export default class UserController {

    constructor(){
        this.userRepository = new UserRepository();
    }

    // 1. Fixed the placement of async and wrapped the try-catch INSIDE the method
    signUp = async (req, res)=>{
        try {   
            const { name, email, password, type } = req.body;
            const newUser = new UserModel(name, email, password, type);
            await this.userRepository.signUp(newUser);
            return res.status(201).send(newUser);
        } catch (err) {
            // It's better to log the actual error for debugging and send a response to the client
            console.error(err);
            return res.status(500).send("Signup issue in the controller");
        }
    }

    // 2. Made this method async as well, assuming your Model checks a live database
    signIn = async (req, res)=>{
        try {
            const { email, password } = req.body;
            const result = await this.userRepository.signIn(email, password);
            
            if (!result) {
                return res.status(400).send("Incorrect credentials");
            } else {
                // Generates the JWT authentication token
                const token = jwt.sign(
                    { userID: result.id, email: result.email }, 
                    "mq6FHCEFFN7RD8KW90ZtQyrb", 
                    { expiresIn: '1h' }
                );
                return res.status(200).send(token);
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send("Signin issue in the controller");
        }
    }
}