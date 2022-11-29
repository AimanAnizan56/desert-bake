import { IronSessionOptions } from "iron-session";

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
