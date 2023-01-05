import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironSessionOptions } from '../../../../lib/helper';
import OrderController from '../../../../controller/Order.controller';

const handler = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await OrderController.createOrder(req, res);
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await OrderController.getOrders(req, res);
});

export default withIronSessionApiRoute(handler, ironSessionOptions);
