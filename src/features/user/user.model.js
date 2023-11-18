import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../error/applicationError.js";

export default class UserModel{
    constructor(name,email,password,type,id)
    {
        this.name = name;
        this.email = email,
        this.password = password,
        this.type = type;
        this._id = id;
    }
    static getAll()
    {
        return users;
    }
}

let users = [
    {
    id : 1,
    email: 'seller@ecom.com',
    name : 'Seller User',
    password : 'Password1',
    type : 'Seller',
},
];