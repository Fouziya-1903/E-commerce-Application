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
        const payload = jwt.verify(token, "mq6FHCEFFN7RD8KW90ZtQyrb");
        console.log(payload);
    }catch(err){
        //return error
        return res.status(401).send("Unauthorized");
    }
    //call next middleware
    next();
}
 
export default jwtAuth;