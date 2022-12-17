import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import ProductController from '../../../../controller/Product.controller';
import { MultiPartyMiddleware } from '../../../../lib/helper';

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
handler.use(MultiPartyMiddleware).post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { statusCode, body } = await ProductController.createProduct(req);

  res.status(statusCode).json(body);
});

export default handler;
