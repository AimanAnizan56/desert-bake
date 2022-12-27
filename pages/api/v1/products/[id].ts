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

const productRoute = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

productRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await ProductController.getProductById(req, res);
});

productRoute.patch(MultiPartyMiddleware, async (req: NextApiRequest, res: NextApiResponse) => {
  await ProductController.updateProduct(req, res);
});

productRoute.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  await ProductController.deleteProduct(req, res);
});

export default withIronSessionApiRoute(productRoute, ironSessionOptions);
