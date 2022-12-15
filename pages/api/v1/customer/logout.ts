import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import CustomerController from '../../../../controller/Customer.controller';
import { ironSessionOptions } from '../../../../lib/helper';

const logoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { statusCode, body } = await CustomerController.logout(req);

  res.status(statusCode).json(body);
};

export default withIronSessionApiRoute(logoutHandler, ironSessionOptions);
