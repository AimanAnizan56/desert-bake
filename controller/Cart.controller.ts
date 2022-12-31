import { NextApiRequest, NextApiResponse } from 'next';
import Cart from '../model/Cart.model';
import Item from '../model/Items.model';
import Product from '../model/Product.model';

export default class CartItemController {
  static addToCart = async (req: NextApiRequest, res: NextApiResponse) => {
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

    // check if cart already exist by status (cart model)
    // get cart id if cart exist (cart model)
    // if not exist, create new cart with params customer id (cart model)
    const userCart = new Cart();
    userCart.setCustomerId(parseInt(req.session.user.id));

    // get new created cart id (cart model)
    let { cartId }: any = await userCart.getUserCartId();

    if (cartId == -99) {
      const temp = await userCart.createCartId();
      cartId = temp?.cartId;
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

    if (product.length == 0) {
      res.status(400).json({
        message: 'Product with such id not exist',
      });
      return;
    }

    const item = new Item();
    const { message }: any = await item.setItem(product_id, cartId);

    if (message == 'Item id not exist') {
      await item.createItem();
    }

    const success = await item.addToCart();

    if (!success) {
      res.status(500).json({
        message: 'Internal server error. Cannot add to cart',
      });
    }

    res.status(200).json({
      message: 'Successfully add to cart',
    });
  };

  static removeFromCart = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.session.user) {
      res.status(400).json({
        message: 'Please login first',
      });
      return;
    }

    if (req.session.user && req.session.user.admin) {
      res.status(400).json({
        message: 'Only customer can remove to cart',
      });
      return;
    }

    const userCart = new Cart();
    userCart.setCustomerId(parseInt(req.session.user.id));

    const { cartId }: any = await userCart.getUserCartId();

    if (cartId == -99) {
      res.status(400).json({
        message: 'Cart id not found',
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

    if (product.length == 0) {
      res.status(400).json({
        message: 'Product with such id not exist',
      });
      return;
    }

    const item = new Item();
    const { message }: any = await item.setItem(product_id, cartId);

    if (message == 'Item id not exist') {
      res.status(400).json({
        message,
      });
      return;
    }

    const success = await item.removeFromCart();

    if (!success || success == 'error') {
      res.status(500).json({
        message: 'Internal server error. Cannot add to cart',
        cause: success == 'error' ? 'Quantity error' : 'No affected row',
      });
      return;
    }

    res.status(200).json({
      message: 'Successfully remove from cart',
    });
  };

  static removeItem = async (req: NextApiRequest, res: NextApiResponse) => {
    // delete item completely
    // get customer cart
    if (!req.session.user) {
      res.status(400).json({
        message: 'Please login first',
      });
      return;
    }

    if (req.session.user && req.session.user.admin) {
      res.status(400).json({
        message: 'Only customer can delete cart',
      });
      return;
    }

    // get item id from request bod
    const { item_id }: any = req.query;

    if (item_id == undefined || item_id.length == 0) {
      res.status(400).json({
        message: 'Please include item id',
      });
      return;
    }

    if (isNaN(item_id)) {
      res.status(400).json({
        message: 'Item id must be a number',
      });
      return;
    }

    // set item id (item model)
    const item = new Item();
    item.setItemId(parseInt(item_id));

    // delete item id
    const success = await item.deleteItem();

    if (!success) {
      res.status(500).json({
        message: 'Cannot delete item. Item id might not exist',
      });
      return;
    }

    res.status(200).json({
      message: 'Item id deleted successfully',
    });
  };

  static getCart = async (req: NextApiRequest, res: NextApiResponse) => {
    // get customer cart
    if (!req.session.user) {
      res.status(400).json({
        message: 'Please login first',
      });
      return;
    }

    if (req.session.user && req.session.user.admin) {
      res.status(400).json({
        message: 'Only customer can view cart',
      });
      return;
    }

    const userCart = new Cart();
    userCart.setCustomerId(parseInt(req.session.user.id));

    const { cartId }: any = await userCart.getUserCartId();

    if (cartId == -99) {
      // response cart is empty
      res.status(200).json({
        message: 'Cart empty',
      });
      return;
    }

    const item = new Item();
    item.setCartId(cartId);
    const { data, message }: any = await item.getItem();

    if (message == 'Empty row') {
      res.status(200).json({
        message: 'Cart empty',
      });
      return;
    }

    res.status(200).json({
      message: 'Cart retrieve',
      cart_id: cartId,
      user_cart: data,
    });
  };
}
