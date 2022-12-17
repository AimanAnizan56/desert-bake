import { IronSessionOptions } from 'iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';

export const hashPassword = (password: string) => {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(password).digest();

  return hash.toString('hex');
};

export const ironSessionOptions = {
  cookieName: process.env.COOKIE_NAME,
  password: process.env.COOKIE_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
} as IronSessionOptions;

export const MultiPartyMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: any) => {
  const form = new multiparty.Form({
    autoFiles: true,
    uploadDir: './public/upload',
  });

  await form.parse(req, (err, fields, files) => {
    if (err) {
      console.log('====================================');
      console.log('Multiparty Error');
      console.log(err);
      console.log('====================================');

      res.status(500).json({
        message: err.message,
      });
      res.end();
    }
    req.body = { ...fields, ...files };
    next();
  });
};
