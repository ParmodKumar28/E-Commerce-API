import { ObjectId } from "mongodb";
import { getDB } from "../../../config/mongodb.js";
import mongoose, { Error } from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { ApplicationError } from "../../error/applicationError.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model('Product', productSchema);
const ReviewModel = mongoose.model('Review', reviewSchema);
const CategoryModel = mongoose.model('Category', categorySchema);

export default class ProductRepository{

    constructor(){
        this.collection = "products";
    }

    async add(productData){
        try {
            // 1. Adding Product.
            productData.categories = productData.category.split(',');
            console.log(productData);
            const newProduct = new ProductModel(productData);
            const savedProduct = await newProduct.save();
            // 2.Update Categories.
            await CategoryModel.updateMany(
                {_id: {$in: productData.categories}},
                {$push: {products: new ObjectId(savedProduct._id)}}
            )
            return savedProduct;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database.", 500);
        }

      }
  
      async get(id){
        try {
            // 1. Get the database
            const db = getDB();
            // 2. Get the collection
            const collection = db.collection(this.collection);
            // 3. Get the document.
            return await collection.findOne({_id: new ObjectId(id)});
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database.", 500);
        }

  
      }
  
      async getAll(){
        try {
            // 1. Get the database
            const db = getDB();
            // 2. Get the collection
            const collection = db.collection(this.collection);
            // 3. Get the documents.
            const products = await collection.find().toArray();
            console.log(products);
            return products;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database.", 500);
        }
          
      }

      async filter(minPrice, categories){
        try {
            // 1. Get the database
            const db = getDB();
            // 2. Get the collection
            const collection = db.collection(this.collection);
            // 3. Get the documents.
            let filterExpression = {};
            if(minPrice){
                filterExpression.price = {$gte : parseFloat(minPrice)}
            }

            // ['Cat1, 'Cat2'];
            categories = JSON.parse(categories.replace(/'/g, '"'));
            console.log(categories);
            if(categories){
                filterExpression = {$or: [{category: {$in: categories}}, filterExpression]}
                // filterExpression.category = category;
            }
            return await collection.find(filterExpression).project({name: 1, price: 1, _id: 0, ratings: {$slice: -1}}).toArray();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database.", 500);
        }

      }

    //     async rate(userID, productID, rating){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         // 1. Find the product
    //         const product = await collection.findOne({_id:new ObjectId(productID)})
    //         // 2. Find the rating
           
    //         const userRating = await product?.ratings?.find(r=>r.userID==userID);
    //         if(userRating){
    //         // 3. Update the rating
    //         await collection.updateOne({
    //             _id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)
    //         },{
    //             $set:{
    //                 "ratings.$.rating":rating
    //             }
    //         }
    //         );
    //         }else{
    //             await collection.updateOne({
    //                 _id:new ObjectId(productID)
    //             },{
    //                 $push: {ratings: {userID:new ObjectId(userID), rating}}
    //             })
    //         }
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }
    
    async rate(userID, productID, rating){
        try{
            // 1. Check if product exists.
            const productToUpdate = await ProductModel.findById(productID);
            if(!productToUpdate)
            {
                throw new Error("Product not found");
            }
            // 2. Find the existing review
            const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
            if(userReview)
            {
                userReview.rating = rating;
                await userReview.save();
            }
            else
            {
                const newReview = new ReviewModel({
                    product: new ObjectId(productID),
                    user: new ObjectId(userID),
                    rating: rating
                });
                await newReview.save();
            }

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async averagePricePerCategory()
    {
        try {
            const db = getDB();
            return await db.collection(this.collection)
            .aggregate([
                {
                    // Stage 1: Get average price per category
                    $group:{
                        _id:"$category",
                        averagePrice:{$avg: "$price"}
                    }
                }
            ]).toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

}