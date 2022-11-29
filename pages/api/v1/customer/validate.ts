import type { NextApiRequest, NextApiResponse } from 'next';
import { Customer } from '../../../../model/Customer.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  const customer = new Customer('', email, '');
  const validate = await customer.validate();

  // todo -- change for better message
  if (!validate) {
    res.status(200).json({
      message: 'Email has already registered',
      error: true,
    });
    return;
  }

  res.status(200).json({
    message: 'Email not been registered yet',
    error: false,
  });
}
