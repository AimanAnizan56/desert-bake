import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import CustomerController from '../../../../controller/Customer.controller';

const validateRoute = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

validateRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { statusCode, body } = await CustomerController.validateEmail(req);

  res.status(statusCode).json(body);
});

export default validateRoute;
