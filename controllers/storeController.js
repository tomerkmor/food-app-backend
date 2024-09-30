import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'; // Import the path module
import fs from 'fs/promises';

// Calculate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mealsFilePath = path.join(__dirname, '../data/available-meals.json');
const ordersFilePath = path.join(__dirname, '../data/orders.json'); // Path for orders

// Function to get meals
export const getMeals = async (req, res) => {
  try {
    const data = await fs.readFile(mealsFilePath, 'utf-8');
    const meals = JSON.parse(data);
    res.json(meals);
  } catch (error) {
    console.error('Error reading meals file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to add an order
export const addOrder = async (req, res) => {
  const newOrder = req.body; // Assuming the order is sent in the body
  try {
    const existingOrders = await fs.readFile(ordersFilePath, 'utf-8');
    const orders = JSON.parse(existingOrders);
    
    // Add new order to existing orders
    orders.push(newOrder);

    // Write updated orders back to file
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2)); // Pretty print JSON
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error writing order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
