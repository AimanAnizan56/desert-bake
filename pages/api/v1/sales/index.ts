import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import SalesController from '../../../../controller/Sales.controller';
import { ironSessionOptions } from '../../../../lib/helper';

const handler = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await SalesController.getData(req, res);
});

export default withIronSessionApiRoute(handler, ironSessionOptions);
