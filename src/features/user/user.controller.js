import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';

export default class UserController {

    constructor(){
        this.userRepository = new UserRepository();
    }

    // 1. Fixed the placement of async and wrapped the try-catch INSIDE the method
    signUp = async (req, res, next)=>{
        try {   
            const { name, email, password, type } = req.body;

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = new UserModel(name, email, hashedPassword, type);
            await this.userRepository.signUp(newUser);
            return res.status(201).send(newUser);
        } catch (err) {
            // It's better to log the actual error for debugging and send a response to the client
            console.error(err);
            next(err);
        }
    }

    // 2. Made this method async as well, assuming your Model checks a live database
    signIn = async (req, res, next)=>{
        try {            
            const user = await this.userRepository.findByMail(req.body.email);

            if(!user){
                res.status(400).send("incorrect credentials");
            }else{
                const result= await bcrypt.compare(req.body.password, user.password);
                if(result){
                    console.log("LOGIN SUCCESS -> RAW USER OBJECT FROM DB IS:", user);
                    const token = jwt.sign(
                    { userId: user._id, email: user.email }, 
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
            next(err);
            return res.status(500).send("Signin issue in the controller");        
        }
    }
} 