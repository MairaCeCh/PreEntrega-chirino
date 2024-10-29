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
//motor de plantillas
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
///api////
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


///vistas
app.use("/views", viewsRouter)


// Socket.io

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

///////productos

app.get("/api/products", (req, res) => {
  const limit = parseInt(req.query.limit) || storeProducts.length;
  const limitedProducts = storeProducts.slice(0, limit);

  if (storeProducts.length > 0) {
    const productsText = limitedProducts
      .map(
        (product) =>
          `ID: ${product.id}, Title: ${product.title}, Price: ${product.price} <br/>`
      )
      .join("\n");
    res.status(200).send(productsText);
  } else {
    res.status(404).send("No products found");
  }
});

app.get("/api/products/:pid", (req, res) => {
  const productId = req.params.pid;
  const product = storeProducts.find((product) => product.id == productId);
  if (!product) {
    res.status(404).send("no existe el producto");
  }
  res.status(200).send(product);
});

app.post("/api/products", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;
  const status = req.body.status === undefined ? true : req.body.status;
  if (
    !title ||
    !description ||
    !code ||
    !price ||
    status === undefined ||
    !stock ||
    !category
  ) {
    return res
      .status(400)
      .send({ error: "Faltan campos obligatorios", data: [] });
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
    thumbnails: thumbnails || [],
  };
  storeProducts.push(newProduct);
  await fs.promises.writeFile(
    "./src/products.json",
    JSON.stringify(storeProducts, null, 2)
  );
  res.status(200).send({ error: null, data: newProduct });
});

app.put("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  const index = storeProducts.findIndex((element) => element.id == id);
  if (index !== -1) {
    let updatedProduct = { ...storeProducts[index], ...req.body };
    storeProducts[index] = updatedProduct;
    await fs.promises.writeFile(
      "./src/products.json",
      JSON.stringify(storeProducts, null, 2)
    );
    res.status(200).send({ error: null, data: updatedProduct });
  } else {
    res.status(404).send({ error: "No se encuentra el producto", data: [] });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  const index = storeProducts.findIndex((element) => element.id == id);
  if (index !== -1) {
    storeProducts.splice(index, 1);
    await fs.promises.writeFile(
      "./src/products.json",
      JSON.stringify(storeProducts, null, 2)
    );
    res.status(200).send({ error: null, data: "producto borrado" });
  } else {
    res.status(404).send({ error: "no se encuentra el producto", data: [] });
  }
});
/////////carrito

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




