import type { NextApiRequest, NextApiResponse } from 'next';
import CustomerController from '../../../../controller/Customer.controller';
import nextConnect from 'next-connect';

const handler = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { statusCode, body } = await CustomerController.createCustomer(req);

  res.status(statusCode).json(body);
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // ! only for admin
  // todo - check if the user is admin
  // todo --> research how to use session in next or nodejs

  // add to retrieve all customer data
  const { statusCode, body } = await CustomerController.getCustomers(req);

  res.status(statusCode).json(body);
});

export default handler;
