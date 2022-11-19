import type { NextApiRequest, NextApiResponse } from 'next';
import { Customer } from '../../../../model/Customer.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method == 'GET') {
    // ! only for admin
    // todo - add to retrieve all customer data
    await GetHandler(req, res);
  } else if (method == 'POST') {
    await PostHandler(req, res);
  }
}

const GetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await Customer.getAllCustomerData();
  res.status(200).json({
    length: data.length,
    data,
  });
};

const PostHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password } = req.body;

  if (name == undefined || email == undefined || password == undefined || name.length == 0 || email.length == 0 || password.length == 0) {
    res.status(400).send({
      message: 'Please provide name, email and password',
      detail: 'Ensure that the name, email and password are included',
    });

    return {
      statusCode: 400,
      send: {
        message: 'Please provide name, email and password',
        detail: 'Ensure that the name, email and password are included',
      },
    };
  }
  const customer = new Customer(name, email, password);

  // check if email is exist
  const validate: boolean = await customer.validate();

  if (!validate) {
    res.status(400).send({
      message: 'Email has been used',
      detail: 'Please provide another email',
    });
    return;
  }

  // insert into database
  const row: any = await customer.insertDb();

  if (row.error) {
    res.status(400).send({
      message: row.error,
      data: row,
    });
    return;
  }
  res.status(201).send({
    message: 'Successfully created',
    data: row,
  });
};
