import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';

export default class UserController {

    constructor(){
        this.userRepository = new UserRepository();
    }

    // 1. Fixed the placement of async and wrapped the try-catch INSIDE the method
    signUp = async (req, res)=>{
        try {   
            const { name, email, password, type } = req.body;

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = new UserModel(name, email, hashedPassword, type);
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
            const user = await this.userRepository.findByMail(req.body.email);

            if(!user){
                res.status(400).send("incorrect credentials");
            }else{
                const result= bcrypt.compare(req.body.password, user.password);
                if(result){
                    const token = jwt.sign(
                    { userID: result.id, email: result.email }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: '1h' }
                );
                return res.status(200).send(token);
                }else{
                    return res.status(400).send("Incorrect credentials");
                }
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send("Signin issue in the controller");
        }
    }
} 