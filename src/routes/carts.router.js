import { Router } from 'express';
import { nanoid } from 'nanoid';
import fs from 'fs';


const router = Router();
let storeCarts = [];


async function fetchCarts(filePath) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        storeCarts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }
}

fetchCarts('./src/carts.json');

let storeProducts = [];

async function fetchProducts(filePath) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        storeProducts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }
}

fetchProducts('./src/products.json');

router.get('/:cid', (req, res) => {
    const cartID = req.params.cid; 
    const cart = storeCarts.find(element => element.id == cartID);
    if (!cart) {
        return res.status(404).send({ error: "Cart not found", data: null });
    }
    
    res.status(200).send({ data: cart.products });
});

router.post('/', async (req, res) => {
    const newCart = { id: nanoid(10), products: [] };
    storeCarts.push(newCart);
    await fs.promises.writeFile('./src/carts.json', JSON.stringify(storeCarts, null, 2));
    res.status(201).send({ error: null, data: newCart });
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const cart = storeCarts.find(c => c.id == cid);
    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado' });
    }
    const productExists = storeProducts.some(p => p.id == pid);
    if (!productExists) {
        return res.status(404).send({ error: 'Producto no encontrado' });
    }
    const productInCart = cart.products.find(p => p.product == pid);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }
    await fs.promises.writeFile('./src/carts.json', JSON.stringify(storeCarts, null, 2));
    res.status(200).send({ error: null, data: cart });
});

export default router;