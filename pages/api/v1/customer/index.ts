import type { NextApiRequest, NextApiResponse } from 'next';
import CustomerController from '../../../../controller/Customer.controller';
import nextConnect from 'next-connect';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironSessionOptions } from '../../../../lib/helper';

const handler = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await CustomerController.createCustomer(req, res);
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await CustomerController.getCustomers(req, res);
});

export default withIronSessionApiRoute(handler, ironSessionOptions);
