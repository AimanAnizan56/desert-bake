import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import CustomerController from '../../../../controller/Customer.controller';
import { ironSessionOptions } from '../../../../lib/helper';
import nextConnect from 'next-connect';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: string;
      name: string;
      email: string;
      admin: boolean;
    };
  }
}

const loginRoute = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

loginRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await CustomerController.login(req, res);
});

export default withIronSessionApiRoute(loginRoute, ironSessionOptions);
