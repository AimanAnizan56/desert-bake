import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import AdminController from '../../../../controller/Admin.controller';
import { ironSessionOptions } from '../../../../lib/helper';
import nextConnect from 'next-connect';

const loginRoute = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

loginRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await AdminController.login(req, res);
});

export default withIronSessionApiRoute(loginRoute, ironSessionOptions);
