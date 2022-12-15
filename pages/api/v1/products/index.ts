import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import multiparty from 'multiparty';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

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

// middleware
handler.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  const form = new multiparty.Form();

  await form.parse(req, (err, fields, files) => {
    if (err) next({ err });
    req.body = { ...fields, ...files };
    next();
  });
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
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
