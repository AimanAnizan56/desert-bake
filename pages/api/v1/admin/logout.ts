import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import AdminController from '../../../../controller/Admin.controller';
import { ironSessionOptions } from '../../../../lib/helper';

const logoutHandler = (req: NextApiRequest, res: NextApiResponse) => {
  AdminController.logout(req, res);
};

export default withIronSessionApiRoute(logoutHandler, ironSessionOptions);
