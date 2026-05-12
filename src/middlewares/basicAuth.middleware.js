import UserModel from "../features/user/user.model.js";

export const basicAuthorizer = (req, res, next)=>{
    const authHeader = req.headers["authorization"];

    if(!authHeader){
        res.status(401).send("No authorization details found");
    }

    console.log(authHeader);

    const base64Credentials = authHeader.replace('Basic ','');
    console.log(base64Credentials);

    const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    console.log(decodedCredentials);

    const creds = decodedCredentials.split(':');

    const user = UserModel.getAll().find((u)=> u.email == creds[0] && u.password == creds[1]);

    if(user){
        next();
    }else{
        return res.status(401).send("Invalid User");
    }
}