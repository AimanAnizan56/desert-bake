import { NextApiRequest } from 'next';
import { makeQuery } from '../lib/mysql_config';
import Product from '../model/Product.model';

export default class ProductController {
  static createProduct = async (req: NextApiRequest) => {
    const { name, price, description, type, image } = req.body;

    if (name == undefined || price == undefined || description == undefined || type == undefined || image == undefined) {
      return {
        statusCode: 400,
        body: {
          message: 'Please provide name, price, description, type and image for the product',
        },
      };
    }

    const product = new Product(name[0], parseFloat(price[0]), description[0], type[0]);
    product.setImage(image[0]);

    const row: any = await product.createProduct();

    if (row.error) {
      return {
        statusCode: 400,
        body: {
          message: row.error,
          data: row,
        },
      };
    }

    return {
      statusCode: 201,
      body: {
        message: 'Successfully created',
        data: row,
      },
    };
  };

  static getProducts = async (req: NextApiRequest) => {
    const data = await makeQuery('SELECT * FROM product');

    if (data.length > 0) {
      return {
        statusCode: 200,
        body: {
          length: data.length,
          data,
        },
      };
    }

    return {
      statusCode: 204,
      body: {
        message: 'No products found',
      },
    };
  };

  static getProductById = async (req: NextApiRequest) => {
    const { id } = req.query;

    const data = await makeQuery('SELECT * FROM product WHERE product_id=?', [id]);

    if (data == 0) {
      return {
        statusCode: 200,
        body: {
          message: 'Product not found',
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        data: data[0],
      },
    };
  };

  static updateProduct = async (req: NextApiRequest) => {
    // todo - update product using product id
  };

  static deleteProduct = async (req: NextApiRequest) => {
    // todo - delete product using product id
  };
}
