import jwt from 'jsonwebtoken';
const jwtAuth = (req,res,next)=>{
    // 1. Read the token.
    const token = req.headers['authorization'];
    console.log(req.headers);
    console.log(token);

    // 2. If no token return the error.
    if(!token)
    {
        return res.status(401).send('Unauthorized');
    }

    // 3. Check if token is valid.
    try {
        const payload = jwt.verify(
            token,
            'B4qgW5Cf5yFDCFoF3wleaNXoaO5Ps2xu'
            );
            // Adding userID to request object which is used in code in other places for security
            req.userID = payload.userID;
    } catch (err) {
        // 4. Return error
        return res.status(401).send('Unauthorized');
    }

    // 5. Call next middleware
    next();
}

export default jwtAuth;