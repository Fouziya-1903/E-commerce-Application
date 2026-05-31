import mongoose from "mongoose";
import {userSchema} from "./user.schema.js"
import { ApplicationError } from "../../error-handler/applicationError.js";
//compile model based on schema

const userModel = mongoose.model('User', userSchema);

export default class userRepository{
    async signUp(userPayload){
        try{
            const newUser = new userModel(userPayload);
            await newUser.save();
            return newUser;
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in the mongoose user.newRepository.js", 500);
        }
    }

    async signIn(email, password){
        try{
            const user = await userModel.findOne({ email }).select("+password");
            if(!user){
                return null;
            }

            console.log("------------------ AUTH DEBUG ------------------");
            console.log("1. RAW PASSWORD FROM POSTMANPAYLOAD:", password);
            console.log("2. PASSWORD ATTRIBUTE FROM DB OBJECT:", user.password);
            console.log("------------------------------------------------");

            // Execute the schema instance method we built to verify the bcrypt hash matrix safely
            const isPasswordMatched = await user.comparePassword(password, user.password);
            if (!isPasswordMatched) {
                return null;
            }
            user.password = undefined;
            return user;
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in the mongoose user.newRepository.js", 500);
        }
    }

    async findByMail(email){
        try{
            return await userModel.findOne({email});
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in the mongoose user.newRepository.js", 500);
        }
    }

    async resetPassword(userId, newPassword){
        try{
            let user = await userModel.findById(userId);
            if(user){
                user.password = newPassword; 
                user.save();
            }else{
                throw new ApplicationError("User not found");
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in the mongoose user.newRepository.js", 500);    
        }
    }
}