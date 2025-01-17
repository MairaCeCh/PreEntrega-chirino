import { Router } from "express";
import productsRouter from "./products.router"
import cartsRouter from "./carts.router"
import sessionRouter from "./sessions.router"

const router = Router();

router.use("/products" , productsRouter)
router.use("/carts", cartsRouter)
router.use("/sessions", sessionRouter)


export default router