import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ironSessionOptions } from '../../../../lib/helper';

const logoutHandler = (req: NextApiRequest, res: NextApiResponse) => {
  req.session.destroy();
  if (req.session.user == undefined) {
    res.status(200).json({ logout: true, message: 'Logout success' });
    return;
  }
  res.status(500).json({
    error: true,
    message: 'Logout failed',
  });
};

export default withIronSessionApiRoute(logoutHandler, ironSessionOptions);
