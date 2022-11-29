import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ironSessionOptions } from '../../../../lib/helper';
import { Customer } from '../../../../model/Customer.model';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: string;
      email: string;
      admin: boolean;
    };
  }
}

const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  const data = await Customer.getCustomerData(email, password);

  if (data.length == 0) {
    res.status(401).json({ ok: false });
    return;
  }

  req.session.user = {
    id: data.customer_id,
    email: data.customer_email,
    admin: false,
  };

  await req.session.save();
  res.status(200).json({ ok: true });
};

export default withIronSessionApiRoute(loginRoute, ironSessionOptions);
