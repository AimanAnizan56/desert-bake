import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import ProductController from '../../../../controller/Product.controller';

const productRoute = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

productRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { statusCode, body } = await ProductController.getProductById(req);

  res.status(statusCode).json(body);
});

export default productRoute;
