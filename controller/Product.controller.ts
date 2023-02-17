import { NextApiRequest, NextApiResponse } from 'next';
import Product from '../model/Product.model';
import { emailAnnounceProduct } from '../lib/mailtrap';
import Item from '../model/Items.model';
import Cart from '../model/Cart.model';

export default class ProductController {
  static createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, price, description, type, image } = req.body;

    if (name == undefined || price == undefined || description == undefined || type == undefined || image == undefined) {
      res.status(400).json({
        message: 'Please provide name, price, description, type and image for the product',
      });
      return;
    }

    const product = new Product(name[0], parseFloat(price[0]), description[0], type[0]);
    await product.setImage(image[0]);

    const row: any = await product.createProduct();

    if (row.error) {
      res.status(400).json({
        message: row.error,
        data: row,
      });
      return;
    }

    const emailRes: any = await emailAnnounceProduct(product, image[0]);

    if (!emailRes.success) {
      const noCust = emailRes.message == 'No customer has register yet';

      res.status(noCust ? 201 : 400).json({
        message: noCust ? emailRes.message : 'Cannot send email to the user',
      });
      return;
    }

    res.status(201).json({
      message: 'Successfully created',
      data: row,
    });
  };

  static getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    const data = await Product.getProducts();

    if (data.length > 0) {
      res.status(200).json({
        length: data.length,
        data,
      });
      return;
    }

    res.status(204).end();
  };

  static getProductById = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (id == undefined) {
      res.status(400).json({
        message: 'Please provide product id',
      });
      return;
    }

    if (isNaN(parseInt(id as string))) {
      res.status(400).json({
        message: 'Product id is not a number',
      });
      return;
    }

    const data = await Product.getProduct(parseInt(id as string));

    if (data == 0) {
      res.status(204).json({
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      data: data[0],
    });
  };

  static updateProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const { name, price, description, type, image } = req.body;

    if (id == undefined || name == undefined || price == undefined || description == undefined || type == undefined) {
      res.status(400).json({
        message: 'Please provide id, name, price and type of product',
      });
      return;
    }

    if (isNaN(parseInt(id as string))) {
      res.status(400).json({
        message: 'Product id is not a number',
      });
      return;
    }

    const product = new Product(name[0], price[0], description[0], type[0]);
    product.setId(parseInt(id as string));
    let row: any = await product.updateProduct();

    if (row.error) {
      res.status(500).json({
        message: row.message,
      });
      return;
    }

    if (image != undefined) {
      await product.setImage(image[0]);
      row = await product.updateProductImage();
    }

    await Item.updatePrice(parseInt(id as string), price[0]);

    await Cart.recalculateTotal();
    res.status(200).json({
      message: 'Successfully updated',
      data: row,
    });
  };

  static deleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (id == undefined) {
      res.status(400).json({
        message: 'Please provide product id',
      });
      return;
    }

    if (isNaN(parseInt(id as string))) {
      res.status(400).json({
        message: 'Product id is not a number',
      });
      return;
    }

    const success = await Product.deleteProduct(parseInt(id as string));

    if (success) {
      res.status(200).json({
        message: 'Successfully deleted',
      });
      return;
    }

    res.status(500).json({
      message: `Cannot delete product id: ${id}`,
    });
  };
}
