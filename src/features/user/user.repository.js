import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserRepository {
    
    // 1. Sign Up Logic
    async signUp(newUser) {
        try {
            const db = getDB();
            const collection = db.collection('users');
            
            await collection.insertOne(newUser);
            return newUser;
        } catch (err) {
            console.error(err);
            throw new ApplicationError("Database issue during user registration");
        } 
    }

    // 2. Sign In Logic
    async signIn(email, password) {
        try {
            const db = getDB();
            const collection = db.collection('users');

            const user = await collection.findOne({ email, password });
            return user;         
        } catch (err) {
            console.error(err);
            throw new ApplicationError("Database issue during sign in");
        }
    }

    // 3. Upgraded Get All Logic (Fetches dynamically from your database!)
    async getAll() {
        try {
            const db = getDB();
            const collection = db.collection('users');
            
            // .find() returns a cursor, .toArray() converts it into a clean list of objects
            const allUsers = await collection.find().toArray();
            return allUsers;
        } catch (err) {
            console.error(err);
            throw new ApplicationError("Could not retrieve users from database");
        }
    }
}