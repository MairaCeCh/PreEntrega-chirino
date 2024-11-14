import { Router } from "express";

import ProductController from "../dao/product.controller.js";
import CartController from "../dao/cart.controller.js";

const CaController = new CartController()
const ProController = new ProductController()

const router = Router();

router.get('/products', async (req, res) => {
    try {
        let url = 'http://localhost:8080/api/products';
        const queryParams = new URLSearchParams(req.query);     
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`; 
        }
        console.log( 'url:',url )
        const response = await fetch(url);
        const products = await response.json();
        res.render('home', { products: products.data });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
});

router.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        console.log('pid:',pid)
       
        const product = await ProController.getOne({_id:pid});
        res.render('product', {product});
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
});

router.get('/:cid/products/:pid', async (req, res) => {
    const pid = req.params.pid
    const cid = req.params.cid
    try {

        const product = await ProController.getOne({_id:pid});
        res.render('product', {product, cid});
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
});

router.get('/products/paginated/:pg',  async(req, res) => {
    const pg = req.params.pg;
    const products = await ProController.getPaginated(pg)
    res.status(200).render('home', { products });
});

router.get('/:cid/products', async (req, res) => {
    const cid = req.params.cid;

    try {

        let url = 'http://localhost:8080/api/products';

        const queryParams = new URLSearchParams(req.query);
       
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`; 
        }
        const response = await fetch(url);
        const products = await response.json();
        res.render('home', { products: products.data, cid });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
});

router.get('/realTimeProducts', (req,res)=> {
    res.status(200).render('realTimeProducts')
})

router.get('/realTimeProducts/paginated/:pg', (req,res)=> {
    const pg = req.params.pg
    res.status(200).render('realTimeProducts', {pg})
})



router.get('/carts', async (req, res)=> {

    try {
        const response = await fetch('http://localhost:8080/api/carts')
        const carts = await response.json();
      //  console.log('carts:',carts)
        res.render('carts', {carts: carts.data});
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }

    })

router.get('/carts/:cid', async(req, res)=> {
    const cid = req.params.cid
    const cart = await CaController.getOne({_id: cid})
    res.status(200).render('cart', {cart})
})
















//////////////////////////////////////////////////////
router.get('/realTimeProducts', (req,res)=> {
    res.status(200).render('realTimeProducts')
})
export default router;