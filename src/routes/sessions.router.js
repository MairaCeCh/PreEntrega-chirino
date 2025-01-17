import { Router } from 'express';

const router = Router();        

router.post("/", async (req, res) => {
 try{
        const userData = req.body;
        const user = await user.controller;



 } catch(error){
     console.log(error)
     res.status(500).send("Error en la creacion de la session")
 }
})



export default router;