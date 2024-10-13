import * as url from "url";
const config = {
  PORT: 8080,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),
  // funcion tipo getter
  get UPLOADS_DIR() {
    return `${this.DIRNAME}/public/uploads`;
  },
};
export default config;
