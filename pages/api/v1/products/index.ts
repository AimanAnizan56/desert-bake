import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
}
