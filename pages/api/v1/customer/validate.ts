import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import CustomerController from '../../../../controller/Customer.controller';
import { ironSessionOptions } from '../../../../lib/helper';

const validateRoute = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

validateRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await CustomerController.validateEmail(req, res);
});

export default withIronSessionApiRoute(validateRoute, ironSessionOptions);
