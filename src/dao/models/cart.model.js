import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

// Anulamos comportamiento de renombre por defecto de colecciones
mongoose.pluralize(null);
import config from "../../config.js";

// Colección
const collection = config.CART_COLLECTION;

const schema = new mongoose.Schema(
  {
    products: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.PRODUCTS_COLLECTION, // Asegúrate de que este sea el nombre correcto del modelo de producto
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }],
  },
  { timestamps: true }
);
schema.plugin(mongoosePaginate);

// Generamos modelo
const cartModel = mongoose.model(collection, schema);

export default cartModel;