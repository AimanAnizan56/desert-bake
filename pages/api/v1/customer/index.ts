import type { NextApiRequest, NextApiResponse } from 'next';
import CustomerController from '../../../../controller/Customer.controller';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method == 'GET') {
    // ! only for admin
    // todo - check if the user is admin
    // todo --> research how to use session in next or nodejs

    // add to retrieve all customer data
    await CustomerController.getAll(req, res);
  } else if (method == 'POST') {
    await CustomerController.create(req, res);
  }
}
