// 1. Import express.
import express from 'express';
import CartItemController from './cartItems.controller.js';

// 2. Initialize Express router.
const cartRouter = express.Router();

const cartController = new CartItemController();

cartRouter.get('/', cartController.get);
cartRouter.post('/', cartController.add);
cartRouter.delete('/:id', cartController.delete);

export default cartRouter;