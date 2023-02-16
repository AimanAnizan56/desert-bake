import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import CustomerController from '../../../../../controller/Customer.controller';
import { ironSessionOptions } from '../../../../../lib/helper';
import nextConnect from 'next-connect';

const loginRoute = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

loginRoute.put(async (req: NextApiRequest, res: NextApiResponse) => {
  await CustomerController.updateCustomer(req, res);
});

export default withIronSessionApiRoute(loginRoute, ironSessionOptions);
