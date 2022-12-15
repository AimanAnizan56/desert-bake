import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import multiparty from 'multiparty';
import { FileReadResult } from 'fs/promises';

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
  const form = new multiparty.Form();
  type DataType = {
    fields: {
      name: [string];
      price: [string];
      description: [string];
      type: [string];
    };
    files: {
      image: [
        [
          {
            fieldName: string;
            originalFilename: string;
            path: string;
            headers: {
              'content-disposition': string;
              'content-type': string;
            };
            size: number;
          }
        ]
      ];
    };
  };

  const data: DataType = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject({ err });
      resolve({ fields, files });
    });
  });

  console.log('Form data: ', data.files.image);

  return res.status(200).json({ data });
}
