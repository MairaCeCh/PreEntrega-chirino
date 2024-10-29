import express from "express";
import config from "./config.js";
import fs from "fs";
import { nanoid } from "nanoid";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";
import handlebars from "express-handlebars";


const app = express();



app.engine("handlebars", handlebars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");


let storeProducts = [];
let carts = [];

async function fetchProducts(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    storeProducts = JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
}
fetchProducts("./src/products.json");

async function fetchCarts(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    carts = JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
}

fetchCarts("./src/carts.JSON");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/views", viewsRouter)




const httpServer = app.listen(config.PORT, () => {
  console.log(`todo ok en el puerto ${config.PORT}`);
});
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  socket.on("update_ok", (data) => {
    console.log("update");
    console.log(data);
    socketServer.emit("new_data", data);
  });
});


app.get("/api/carts", (req, res) => {
  if (carts.length > 0) {
    res.status(200).send("carrito ok" + JSON.stringify(carts));
  } else {
    res.status(404).send("No hay carritos disponibles");
  }
});

app.post("/api/carts", async (req, res) => {
  const newCart = {
    id: nanoid(10),
    products: [],
  };

  carts.push(newCart);

  await fs.promises.writeFile(
    "./src/carts.json",
    JSON.stringify(carts, null, 2)
  );
  res.status(201).send({ error: null, data: newCart });
});

app.get("/api/carts/:cid", (req, res) => {
  const cid = req.params.cid;
  const cart = carts.find((element) => element.id == cid);

  if (cart) {
    return res.status(200).json(cart);
  }

  return res.status(404).send("Carrito no encontrado");
});

app.post("/api/carts/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const cart = carts.find((element) => element.id == cid);
  if (!cart) {
    return res.status(404).send({ error: "Carrito no encontrado", data: [] });
  }

  const productInCart = cart.products.find((p) => p.product == pid);
  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  await fs.promises.writeFile(
    "./src/carts.json",
    JSON.stringify(carts, null, 2)
  );
  res.status(201).send({ cart });
});




