import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import AdminController from '../../../../controller/Customer.controller';
import { ironSessionOptions } from '../../../../lib/helper';

const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  AdminController.login(req, res);
};

export default withIronSessionApiRoute(loginRoute, ironSessionOptions);
