import { Router } from 'express';
import { nanoid } from 'nanoid';
import fs from 'fs';

const router = Router();
let storeProducts = [];

const midd1 = (req, res, next) => {
        console.log('se recibio una solicitud GET')
    next()
}

async function fetchProducts(filePath) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        storeProducts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }
}

fetchProducts('./src/products.json');

router.get('/',midd1, (req, res) => {
    const limit = parseInt(req.query.limit) || storeProducts.length;
    const limitedProducts = storeProducts.slice(0, limit);
    res.status(200).send({ error: null, data: limitedProducts });
});

router.get('/:pid', (req, res) => {
    const productId = req.params.pid; 
    const product = storeProducts.find(product => product.id == productId);
    if (!product) {
        return res.status(404).send({ error: "Product not found", data: null });
    }
    res.status(200).send({ error: null, data: product });
});

router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    const status = req.body.status === undefined ? true : req.body.status;
    if (!title || !description || !code || !price || status === undefined || !stock || !category) {
        return res.status(400).send({ error: 'Faltan campos obligatorios', data: [] });
    }
    const newProduct = {
        id: nanoid(10),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails: thumbnails || []
    };
    storeProducts.push(newProduct);
    await fs.promises.writeFile('./src/products.json', JSON.stringify(storeProducts, null, 2));
    res.status(200).send({ error: null, data: newProduct });
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const index = storeProducts.findIndex(element => element.id == id);
    if (index !== -1) {
        let updatedProduct = { ...storeProducts[index], ...req.body };
        storeProducts[index] = updatedProduct;
        await fs.promises.writeFile('./src/products.json', JSON.stringify(storeProducts, null, 2));
        res.status(200).send({ error: null, data: updatedProduct });
    } else {
        res.status(404).send({ error: 'No se encuentra el producto', data: [] });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const index = storeProducts.findIndex(element => element.id == id);
    if (index !== -1) {
        storeProducts.splice(index, 1);
        await fs.promises.writeFile('./src/products.json', JSON.stringify(storeProducts, null, 2));
        res.status(200).send({ error: null, data: 'producto borrado' });
    } else {
        res.status(404).send({ error: 'no se encuentra el producto', data: [] });
    }
});

export default router;