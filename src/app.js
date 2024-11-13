import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import config from "./config.js";

const app = express();

// Activo el motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");
//////////////////////////////////

/// API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

/// Vistas
app.use("/views", viewsRouter);

// Socket.io
const httpServer = app.listen(config.PORT, async () => {
  await mongoose.connect(config.MONGODB_URI);
  console.log(`Server activo en el puerto ${config.PORT} conectado a bbdd`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  socket.on("update_ok", (data) => {
    console.log("update");
    console.log('data:',data);
    socketServer.emit("new_data", data);
  });
});
