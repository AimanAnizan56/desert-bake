import { NextApiRequest } from 'next';
import Product from '../model/Product.model';

export default class ProductController {
  static create = async (req: NextApiRequest) => {
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

    const row: any = await product.create();

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
}
