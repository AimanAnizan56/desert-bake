import { withIronSessionApiRoute } from 'iron-session/next';
import { ironSessionOptions } from '../../../../lib/helper';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import CartItemController from '../../../../controller/Cart.controller';

const cartHandler = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

cartHandler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await CartItemController.removeFromCart(req, res);
});

cartHandler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  await CartItemController.removeItem(req, res);
});

export default withIronSessionApiRoute(cartHandler, ironSessionOptions);
