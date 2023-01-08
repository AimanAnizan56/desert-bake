import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { PaymentController } from '../../../controller/Payment.controller';
import { ironSessionOptions } from '../../../lib/helper';

const stripeRoute = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

stripeRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await PaymentController.createPaymentIntent(req, res);
});

export default withIronSessionApiRoute(stripeRoute, ironSessionOptions);
