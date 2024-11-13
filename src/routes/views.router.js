import { Router } from "express";
//import { promises as fs } from 'fs'

const router = Router();

// async function fetchProducts(filePath) {
//     try {
//         const data = await fs.readFile(filePath, 'utf-8');
//         const products = JSON.parse(data);
//         return products;
//     } catch (error) {
//         console.error('Error al leer el archivo JSON:', error);
//         return [];
//     }
// }

router.get('/', async (req, res) => {
    try {
        const products = await fetchProducts('./src/products.json');
     
        res.render('home', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
});

router.get('/realTimeProducts', (req,res)=> {
    res.status(200).render('realTimeProducts')
})
export default router;