import { NextApiRequest } from 'next';

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

    return {
      statusCode: 200,
      body: {
        product: {
          name,
          price,
          description,
          type,
          image,
        },
      },
    };
  };
}
