import express from 'express';
import { getMeals, addOrder } from '../controllers/storeController.js';

const router = express.Router();

router.get('/meals', getMeals);
router.post('/orders', addOrder); // Added route for orders

export default router;
