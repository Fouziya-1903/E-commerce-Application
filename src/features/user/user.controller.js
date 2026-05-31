import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';

export default class UserController {

    constructor(){
        this.userRepository = new UserRepository();
    }

    signUp = async (req, res, next)=>{
        try {   
            const { name, email, password, type } = req.body;

            // REMOVED manual bcrypt.hash here. 
            // We pass the raw password string directly into the data payload so the Schema RegEx can validate it.
            const newUser = { name, email, password, type };
            
            const createdUser = await this.userRepository.signUp(newUser);
            return res.status(201).json({ success: true, data: createdUser });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    signIn = async (req, res, next)=>{
        try {            
            // Your repository method internally executes findOne and compares the password
            const user = await this.userRepository.signIn(req.body.email, req.body.password);

            if(!user){
                return res.status(400).send("incorrect credentials");
            } else {
                console.log("LOGIN SUCCESS -> RAW USER OBJECT FROM DB IS:", user);
                const token = jwt.sign(
                    { userId: user._id, email: user.email }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: '1h' }
                );
                return res.status(200).send(token);
            }
        } catch (err) {
            console.error(err);
            next(err);       
        }
    }

    resetPassword = async (req, res, next)=>{
        try {
            const { newPassword } = req.body;
            const userId = req.userId;
            
            // REMOVED manual bcrypt.hash here.
            // Pass the raw plain text string. Mongoose re-validates the password before committing it.
            await this.userRepository.resetPassword(userId, newPassword);
            return res.status(200).send("Password is reset");
        } catch(err) {
            console.error(err);
            next(err);
        }
    }
}