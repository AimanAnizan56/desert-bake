import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import CustomerController from '../../../../controller/Customer.controller';
import { ironSessionOptions } from '../../../../lib/helper';

const logoutHandler = (req: NextApiRequest, res: NextApiResponse) => {
  CustomerController.logout(req, res);
};

export default withIronSessionApiRoute(logoutHandler, ironSessionOptions);
