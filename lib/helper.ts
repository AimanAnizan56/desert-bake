export const hashPassword = (password: string) => {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(password).digest();

  return hash.toString('hex');
};
