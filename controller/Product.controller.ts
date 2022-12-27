import { NextApiRequest } from 'next';
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
    const data = await Product.getProducts();

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

    if (id == undefined) {
      return {
        statusCode: 400,
        body: {
          message: 'Please provide product id',
        },
      };
    }

    if (isNaN(parseInt(id as string))) {
      return {
        statusCode: 400,
        body: {
          message: 'Product id is not a number',
        },
      };
    }

    const data = await Product.getProduct(parseInt(id as string));

    if (data == 0) {
      return {
        statusCode: 204,
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
    const { id } = req.query;
    const { name, price, description, type, image } = req.body;

    if (id == undefined || name == undefined || price == undefined || description == undefined || type == undefined) {
      return {
        statusCode: 400,
        body: {
          message: 'Please provide id, name, price and type of product',
        },
      };
    }

    if (isNaN(parseInt(id as string))) {
      return {
        statusCode: 400,
        body: {
          message: 'Product id is not a number',
        },
      };
    }

    const product = new Product(name[0], price[0], description[0], type[0]);
    product.setId(parseInt(id as string));
    let row: any = await product.updateProduct();

    if (row.error) {
      return {
        statusCode: 500,
        body: {
          message: row.message,
        },
      };
    }

    if (image != undefined) {
      product.setImage(image[0]);
      row = await product.updateProductImage();

      // todo - delete previous image
    }

    return {
      statusCode: 200,
      body: {
        message: 'Successfully updated',
        data: row,
      },
    };
  };

  static deleteProduct = async (req: NextApiRequest) => {
    const { id } = req.query;

    if (id == undefined) {
      return {
        statusCode: 400,
        body: {
          message: 'Please provide product id',
        },
      };
    }

    if (isNaN(parseInt(id as string))) {
      return {
        statusCode: 400,
        body: {
          message: 'Product id is not a number',
        },
      };
    }

    const success = await Product.deleteProduct(parseInt(id as string));

    if (success) {
      return {
        statusCode: 200,
        body: {
          message: 'Successfully deleted',
        },
      };
    }

    return {
      statusCode: 500,
      body: {
        message: `Cannot delete product id: ${id}`,
      },
    };
  };
}
