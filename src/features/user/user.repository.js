import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error/applicationError.js";
import { ObjectId } from "mongodb";

// Creating model from schema.
const UserModel = mongoose.model('User', userSchema);

export default class UserRepository{

    async resetPassword(userID,hashedPassword)
    {
        try {
            const user = await UserModel.findOne({_id: new ObjectId(userID)});
            if(user)
            {
                user.password = hashedPassword;
                await user.save();
            }
            else{
                throw new Error("No such user found.");
            }
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database.", 500);
        }
    }

    async signUp(user)
    {
        try {
            // Create instance of model.
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser;
        } catch (err) {
            if(err instanceof mongoose.Error.ValidationError)
            {
                throw err;
            }
            else
            {
                console.log(err);
                throw new ApplicationError("Something went wrong with database.", 500);
            }

        }
        
    }

    async signIn(email,password)
    {
        try {
            return await UserModel.findOne({email,password});
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database.", 500);
        }
    }

    async findByEmail(email)
    {
        try {
            return await UserModel.findOne({email});
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database.", 500);
        }

    }  
}