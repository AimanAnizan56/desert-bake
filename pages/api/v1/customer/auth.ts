import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ironSessionOptions } from '../../../../lib/helper';
import { Customer } from '../../../../model/Customer.model';

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
  if (req.method != 'POST' && req.method == 'GET') {
    // GET-- get current customer login cookie
    const user = req.session.user;

    // if customer not login
    if (user == undefined) {
      res.status(400).json({ login: false, message: 'Customer not login yet' });
      return;
    }

    res.status(200).json(user);
    return;
  } else if (req.method != 'POST') {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
    return;
  }

  // POST - Authenticate user begin
  if (req.session.user != undefined) {
    res.status(400).json({ error: false, message: 'Customer has already login' });
    return;
  }

  const { email, password } = req.body;
  const data = await Customer.getCustomerData(email, password);

  if (data.length == 0) {
    res.status(401).json({ error: true, message: 'Login failed' });
    return;
  }

  req.session.user = {
    id: data.customer_id,
    name: data.customer_name,
    email: data.customer_email,
    admin: false,
  };

  await req.session.save();
  res.status(200).json({ error: false, message: 'Login success' });
};

export default withIronSessionApiRoute(loginRoute, ironSessionOptions);
