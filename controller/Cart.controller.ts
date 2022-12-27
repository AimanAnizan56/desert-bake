import { NextApiRequest, NextApiResponse } from 'next';

export default class CartItemController {
  static addToCart = async (req: NextApiRequest, res: NextApiResponse) => {
    // todo - add to cart
    // check if cart already exist by status (cart model)
    // get cart is if cart exist (cart model)
    // if not exist, create new cart with params customer id (cart model)
    // get new created cart id (cart model)
    // use cart id to add into item - use method in item model (item model)

    res.send('cart item controller');
  };
}
