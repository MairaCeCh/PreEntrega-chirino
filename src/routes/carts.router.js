import { Router } from "express";

import CartController from "../dao/cart.controller.js";

const router = Router();
const controller = new CartController();

let storeProducts = [];

// async function fetchProducts(filePath) {
//   try {
//     const data = await fs.promises.readFile(filePath, "utf-8");
//     storeProducts = JSON.parse(data);
//   } catch (error) {
//     console.error("Error reading JSON file:", error);
//   }
// }

// fetchProducts("./src/products.json");

router.get('/', async (req, res)=> {
    const process = await controller.get()
    res.status(200).send({error: null, data: process})
})

router.get("/:cid", async(req, res) => {
  const cartID = req.params.cid;
  try {
    const cart = await controller.getOne({_id:cartID});
    res.send({cart});
} catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).render('error', { message: 'Error al cargar los productos' });
}
});


router.post("/", async (req, res) => {
  const process = await controller.add({products: []});
  res.status(201).send({ error: null, data: process });
});


router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await controller.fOne({ _id: cid });
    
    if (!cart) {
        console.log('Carrito no encontrado:', cart);
        return res.status(406).send({ error: "Carrito no encontrado" });
    }
    
    const productInCart = cart.products.find((product) => product._id.toString() === pid);

    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.products.push({ _id: pid, quantity: 1 });
    }
    
    
    const cartToUpdate = {
        _id: cart._id.toString(),
        products: cart.products
    };
    
    const updatedCart = await controller.addProduct(cartToUpdate);
    
    res.status(200).send({ error: null, data: updatedCart });
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
   
        const cart = await controller.fOne({ _id: cid });
        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        const updatedProducts = cart.products.filter(product => product._id.toString() !== pid);

        const updatedCart = await controller.update(
            { _id: cid }, 
            { products: updatedProducts }, 
            { new: true } 
        );

        res.status(200).send({ error: null, data: updatedCart });
    } catch (err) {
        console.error("Error al eliminar el producto del carrito:", err);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await controller.fOne({ _id: cid });
        console.log('cart:', cart);
        
        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        const updatedCart = await controller.update(
            { _id: cid }, 
            { products: [] }, 
            { new: true } 
        );

        res.status(200).send({ error: null, data: updatedCart });
    } catch (err) {
        console.error("Error al eliminar todos los productos del carrito:", err);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

export default router;
