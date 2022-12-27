import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import ProductController from '../../../../controller/Product.controller';
import { ironSessionOptions, MultiPartyMiddleware } from '../../../../lib/helper';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

// middleware - using multiparty (from lib)
handler.post(MultiPartyMiddleware, async (req: NextApiRequest, res: NextApiResponse) => {
  await ProductController.createProduct(req, res);
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await ProductController.getProducts(req, res);
});

export default withIronSessionApiRoute(handler, ironSessionOptions);
