import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironSessionOptions } from '../../../../lib/helper';
import { PaymentController } from '../../../../controller/Payment.controller';

const handler = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await PaymentController.getPayments(req, res);
});

export default withIronSessionApiRoute(handler, ironSessionOptions);
