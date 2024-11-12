import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import config from "../../config.js";

// Anulamos comportamiento de renombre por defecto de colecciones
mongoose.pluralize(null);

// Colección
const collection = config.PRODUCTS_COLLECTION;

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    thumbnails: { type: [String], default: [] },
  },
  { timestamps: true }
);
schema.plugin(mongoosePaginate);

// Generamos modelo
const productModel = mongoose.model(collection, schema);

export default productModel;