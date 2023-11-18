import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';

export default class UserController{

    constructor(){
        this.userRepository = new UserRepository();
    }

    async resetPassword(req,res,next){
        try {
            const newPassword = req.body.password;
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            const userID = req.userID;
            await this.userRepository.resetPassword(userID, hashedPassword);
            res.status(200).send("Password is updated.");
        } catch (err) {
            console.log(err);
            console.log("Passing error to middleware");
            next(err);
        }
    }

    async SignUp(req,res,next){
        try {
            const {name,email,password,type} = req.body;
            const hashedPassword = await bcrypt.hash(password,12);
            // Passing Normal Password because of validation
            const user = new UserModel(name,email,hashedPassword,type);
            await this.userRepository.signUp(user);
            res.status(201).send(user);
        } catch (err) {
            next(err);
        }

    }

    async SignIn(req,res){
        try {
            const user = await this.userRepository.findByEmail(req.body.email);
            if(!user)
            {
                return res.status(400).send("Inavlid Credentials");
            }
            else
            {
                // Compare password with hashed password.
                const result = await bcrypt.compare(req.body.password,user.password);
                if(result){
                // 1.Create Token
                const token = jwt.sign({userID : user._id, email : user.email},
                    process.env.JWT_SECRET,
                    {expiresIn : '1h'},
                    );
                // 2.Send Token
                return res.status(200).send(token);
                }else{
                    return res.status(400).send("Inavlid Credentials");
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Something went wrong.");
        }

    }
}