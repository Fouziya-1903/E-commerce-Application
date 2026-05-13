import jwt from "jsonwebtoken";
const jwtAuth = (req, res, next)=>{
    //read the token
    const token = req.headers['authorization'];
    //if no token, return the error
    if(!token){
        return res.status(401).send("Unauthorized");
    }
    //check if token is valid or expired
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        //we store it to use the user id in the cart controller to add the cart item
        req.userId = payload.userId;
        console.log(payload);
    }catch(err){
        //return error
        return res.status(401).send("Unauthorized");
    }
    //call next middleware
    next();
}
 
export default jwtAuth;