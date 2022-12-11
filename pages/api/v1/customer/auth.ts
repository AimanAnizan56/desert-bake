import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import CustomerController from '../../../../controller/Customer.controller';
import { ironSessionOptions } from '../../../../lib/helper';

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

const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  CustomerController.login(req, res);
};

export default withIronSessionApiRoute(loginRoute, ironSessionOptions);
