import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import CustomerController from '../../../../controller/Customer.controller';
import { ironSessionOptions } from '../../../../lib/helper';

const logoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await CustomerController.logout(req, res);
};

export default withIronSessionApiRoute(logoutHandler, ironSessionOptions);
