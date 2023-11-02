import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req,res,next)=>{
    // 1. Check if authorizer header is empty.
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    if(!authHeader)
    {
        return res.status(401).send("No authorization detail found");
    }

    // 2. Extract credentials. [Basic qwertyusdfghj345678cvdfgh];
    const base64Credentials = authHeader.replace('Basic', '');
    console.log(base64Credentials);

    // 3. Decode Credentials.
    const decodedCreds = Buffer.from(base64Credentials, 'base64').toString('utf8');
    console.log(decodedCreds); 
    // [username:password]

    const cred = decodedCreds.split(':');
    const user = UserModel.getAll().find(u=>u.email==cred[0] && u.password==cred[1]);
    if(user)
    {
        next();
    }
    else
    {
        res.status(401).send("Incorrect Credentials");
    }
}

export default basicAuthorizer;