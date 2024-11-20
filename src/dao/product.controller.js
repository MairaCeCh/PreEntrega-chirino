import productModel from "./models/product.model.js";

class ProductController {
  constructor() {}

  getAll = async () => {
    try {
      return await productModel.find().lean();
    } catch (err) {
      return err.message;
    }
  };

  get = async (options) => {
    try {
      const { limit , page , sort, filter } = options;

      let sortOptions;
      if (sort) {
        if (sort === 'asc') {
          sortOptions = { price: 1 };
        } else if (sort === 'desc') {
          sortOptions = { price: -1 };
        } else {
          console.error('Invalid sort option'); // Manejo de errores para valores no válidos
        }
      }

      if (!filter || Object.keys(filter).length === 0) {
        return await productModel.paginate({}, {
          limit: limit,
          page: parseInt(page, 10),
          sort: sortOptions,
          lean: true
        });
      }

      return await productModel.paginate(filter, {
        limit: parseInt(limit, 10),
        page: parseInt(page, 10),
        sort: sortOptions,
        lean: true
      });
    } catch (err) {
      return err.message;
    }
  };

  getOne = async (data) => {
    try {
      console.log("data:", data);
      return await productModel.findOne(data).lean();
    } catch (err) {
      console.error("Error al buscar el producto:", err);
      return null;
    }
  };

  getPaginated = async (pg) => {
    try {
      const page = pg || 1;
      return await productModel.paginate(
        {},
        { limit: 10, page: page, lean: true }
      );
    } catch (err) {
      return err.message;
    }
  };

  add = async (data) => {
    try {
      return await productModel.create(data);
    } catch (err) {
      return err.message;
    }
  };

  update = async (filter, updated, options) => {
    try {
      return await productModel.findOneAndUpdate(filter, updated, options);
    } catch (err) {
      return err.message;
    }
  };

  delete = async (data, options) => {
    try {
      return await productModel.findOneAndDelete(data, options);
    } catch (err) {
      return err.message;
    }
  };
}

export default ProductController;
