import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('content-type', req.headers['content-type']);
  const form = new multiparty.Form();
  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject({ err });
      resolve({ fields, files });
    });
  });

  console.log('Form data: ', data);

  return res.status(200).json({ data });
}
