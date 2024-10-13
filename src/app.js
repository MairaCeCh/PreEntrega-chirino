import express from "express";
import config from "./config.js";
import fs from "fs";
import { nanoid } from "nanoid";

const app = express();
let storeProducts = [];

async function fetchProducts(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    storeProducts = JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
}
fetchProducts("./src/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(config.PORT, () => {
  console.log(`gatito feliz ${config.PORT}`);
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
  res.status(200).send("carrito");
});
