import type { NextApiRequest, NextApiResponse } from 'next';
import { Customer } from '../../../../model/Customer.model';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method == 'GET') {
    // ! only for admin
    // todo - add to retrieve all customer data
    res.status(200).json({ data: {} });
  } else if (method == 'POST') {
    const { name, email, password } = req.body;

    if (name == undefined || email == undefined || password == undefined || name.length == 0 || email.length == 0 || password.length == 0) {
      res.status(400).send({
        message: 'Please provide name, email and password',
        detail: 'Ensure that the name, email and password are included',
      });
    }
    // todo - check if email is exist
    // todo - insert into database

    const customer = new Customer(name, email, password);
    res.status(200).send({
      message: 'Successfully created',
      data: customer, // todo - change later
    });
  }
}
