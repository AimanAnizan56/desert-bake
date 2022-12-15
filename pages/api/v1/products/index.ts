import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
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
  const { name, price, description, type, image } = req.body;

  return res.status(200).json({
    product: {
      name,
      price,
      description,
      type,
      image,
    },
  });
});

export default handler;
