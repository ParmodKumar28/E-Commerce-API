// 1. Import express.
import express from 'express';
import LikeController from './like.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

// 2. Initialize Express router.
const likeRouter = express.Router();

const likeController = new LikeController();

likeRouter.post('/', jwtAuth, (req,res,next)=>{
    likeController.likeItem(req,res,next);
});
likeRouter.get('/', jwtAuth, (req,res,next)=>{
    likeController.getLikes(req,res,next);
});


export default likeRouter;