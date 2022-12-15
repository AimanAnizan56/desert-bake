import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import AdminController from '../../../../controller/Admin.controller';
import { ironSessionOptions } from '../../../../lib/helper';
import nextConnect from 'next-connect';

const loginRoute = nextConnect();

loginRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { statusCode, body } = await AdminController.login(req);

  res.status(statusCode).json(body);
});

loginRoute.get((req: NextApiRequest, res: NextApiResponse) => {
  res.status(405).json({ error: true, message: 'Request method not allowed' });
  return;
});

export default withIronSessionApiRoute(loginRoute, ironSessionOptions);
