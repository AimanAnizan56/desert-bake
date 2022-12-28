import { NextApiRequest, NextApiResponse } from 'next';
import Cart from '../model/Cart.model';
import Item from '../model/Items.model';
import Product from '../model/Product.model';

export default class CartItemController {
  static addToCart = async (req: NextApiRequest, res: NextApiResponse) => {
    // todo - add to cart
    if (!req.session.user) {
      res.status(400).json({
        message: 'Please login first',
      });
      return;
    }

    if (req.session.user && req.session.user.admin) {
      res.status(400).json({
        message: 'Only customer can add to cart',
      });
      return;
    }

    const customerId = req.session.user.id;
    // check if cart already exist by status (cart model)
    // get cart id if cart exist (cart model)
    // if not exist, create new cart with params customer id (cart model)
    const userCart = new Cart();
    userCart.setCustomerId(parseInt(req.session.user.id));

    // get new created cart id (cart model)
    const { cartId }: any = await userCart.getUserCartId();

    if (cartId == -99) {
      res.status(500).json({
        message: 'Internal server error',
      });
      return;
    }

    // use cart id to add into item - use method in item model (item model)
    const { product_id } = req.body;

    if (product_id == undefined) {
      res.status(400).json({
        message: 'Please include product id',
      });
    }

    // check product id exist or not
    const product = await Product.getProduct(product_id);
    console.log('product', product);

    if (product.length == 0) {
      res.status(400).json({
        message: 'Product with such id not exist',
      });
      return;
    }

    const item = new Item();
    await item.setItem(product_id, cartId);
    item.output();

    res.send(`post cart item controller ${customerId}, cart id: ${cartId}, product_id: ${product_id}`);
  };

  static getCart = async (req: NextApiRequest, res: NextApiResponse) => {
    // get customer cart

    res.send('get cart item controller');
  };
}
