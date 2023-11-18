import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    likeable: {
        type: mongoose.Schema.ObjectId,
        refPath: 'on_model'
    },
    on_model: {
        type: String,
        enum: ['Product','Category']
    }
}).pre('save', (next)=>{
    console.log("New like is coming in.");
    next();
}).post('save', (doc)=>{
    console.log("Like is saved.");
    console.log(doc);
}).pre('find', (next)=>{
    console.log("Retrieving likes.");
    next();
}).post('find', (doc)=>{
    console.log("Likes.");
    console.log(doc);
})