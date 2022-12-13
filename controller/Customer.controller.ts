import { NextApiRequest, NextApiResponse } from 'next';
import { Customer } from '../model/Customer.model';

export default class CustomerController {
  static login = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != 'POST' && req.method == 'GET') {
      // GET-- get current customer login cookie
      const user = req.session.user;

      // if customer not login
      if (user == undefined) {
        res.status(400).json({ login: false, message: 'Customer not login yet' });
        return;
      }

      res.status(200).json(user);
      return;
    } else if (req.method != 'POST') {
      res.status(405).json({ error: true, message: 'Request method not allowed' });
      return;
    }

    // POST - Authenticate user begin
    if (req.session.user != undefined) {
      res.status(400).json({ error: false, message: 'Customer has already login' });
      return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: true,
        message: 'Email or password is empty',
      });
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      res.status(400).json({
        message: 'Email is invalid',
      });
      return;
    }

    const data = await Customer.getCustomerData(email, password);

    if (data.length == 0) {
      res.status(401).json({ error: true, message: 'Login failed' });
      return;
    }

    req.session.user = {
      id: data.customer_id,
      name: data.customer_name,
      email: data.customer_email,
      admin: false,
    };

    await req.session.save();
    res.status(200).json({ error: false, message: 'Login success' });
  };

  static logout = (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy();
    if (req.session.user == undefined) {
      res.status(200).json({ logout: true, message: 'Logout success' });
      return;
    }
    res.status(500).json({
      error: true,
      message: 'Logout failed',
    });
  };

  // get all customer - for admin
  static getAll = async (req: NextApiRequest, res: NextApiResponse) => {
    const data = await Customer.getAllCustomerData();
    res.status(200).json({
      length: data.length,
      data,
    });
  };

  static create = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, email, password } = req.body;

    if (name == undefined || email == undefined || password == undefined || name.length == 0 || email.length == 0 || password.length == 0) {
      res.status(400).send({
        message: 'Please provide name, email and password',
        detail: 'Ensure that the name, email and password are included',
      });

      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
      res.status(400).json({
        message: 'Email or password is invalid',
      });
      return;
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
}
