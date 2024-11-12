import cartModel from "./models/cart.model.js";
import productModel from "./models/product.model.js";


class CartController {
  constructor() {}

  get = async () => {
    try {
      return await cartModel.find().lean();
    } catch (err) {
      return err.message;
    }
  };

  fOne= async (data) => {
    try {
        console.log("data:", data);
        const cart = await cartModel.findOne(data).lean();
        
        console.log("Cart with populated products:", cart);
        return cart;
    } catch (err) {
        console.error("Error al buscar el carrito:", err);
        return null;
    }
};

  getOne = async (data) => {
    try {
        console.log("data:", data);
        const cart = await cartModel.findOne(data)
            .populate('products._id')
            .lean();
        
        console.log("Cart with populated products:", cart);
        return cart;
    } catch (err) {
        console.error("Error al buscar el carrito:", err);
        return null;
    }
};

  addProduct = async (data) => {
    try {
      console.log(data);
      
      const filter = { _id: data._id };
      const update = {
        $set: {
          products: data.products, 
          updatedAt: new Date() 
        }
      };

      // Realiza la actualización
      return await cartModel.findOneAndUpdate(filter, update, { new: true }).lean(); // Devuelve el carrito actualizado
    } catch (err) {
      console.error("Error al actualizar el carrito", err); // Manejo de errores
    }
  };

  add = async (data) => {
    try {
      return await cartModel.create(
        {data}
      );
    } catch (err) {
      return err.message;
    }
  };

  update = async (filter, updated, options) => {
    try {
      return await cartModel.findOneAndUpdate(filter, updated, options);
    } catch (err) {
      return err.message;
    }
  };

  delete = async (data, options) => {
    try {
      return await cartModel.findOneAndDelete(data, options); 
    } catch (err) {
      return err.message;
    }
  };
}

export default CartController;
