import * as url from "url";
const config = {
  PORT: 8080,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),

  get UPLOADS_DIR() {
    return `${this.DIRNAME}/public/uploads`;
  },

  MONGODB_URI: "mongodb+srv://maira:simba@cluster0.bp4q7.mongodb.net/Coder",
CART_COLLECTION: 'carts',
PRODUCTS_COLLECTION: 'products'
};
export default config;
