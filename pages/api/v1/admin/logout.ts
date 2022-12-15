import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import AdminController from '../../../../controller/Admin.controller';
import { ironSessionOptions } from '../../../../lib/helper';

const logoutHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const { statusCode, body } = AdminController.logout(req);

  res.status(statusCode).json(body);
};

export default withIronSessionApiRoute(logoutHandler, ironSessionOptions);
