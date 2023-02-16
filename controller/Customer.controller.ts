import { NextApiRequest, NextApiResponse } from 'next';
import Customer from '../model/Customer.model';

export default class CustomerController {
  static login = async (req: NextApiRequest, res: NextApiResponse) => {
    // POST - Authenticate user begin
    if (req.session.user != undefined) {
      res.status(400).json({
        error: false,
        message: 'Customer has already login',
      });
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
        error: true,
        message: 'Email is invalid',
      });
      return;
    }

    const data = await Customer.getCustomerData(email, password);

    if (data.length == 0) {
      res.status(401).json({
        error: true,
        message: 'Login failed',
      });
      return;
    }

    req.session.user = {
      id: data.customer_id,
      name: data.customer_name,
      email: data.customer_email,
      admin: false,
    };

    await req.session.save();
    res.status(200).json({
      error: false,
      message: 'Login success',
    });
  };

  static logout = (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy();
    if (req.session.user == undefined) {
      res.status(200).json({
        logout: true,
        message: 'Logout success',
      });
      return;
    }

    res.status(500).json({
      error: true,
      message: 'Logout failed',
    });
    return;
  };

  static createCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, email, password } = req.body;

    if (name == undefined || email == undefined || password == undefined || name.length == 0 || email.length == 0 || password.length == 0) {
      res.status(400).json({
        message: 'Please provide name, email and password',
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
      res.status(400).json({
        message: 'Please provide another email',
      });
      return;
    }

    // insert into database
    const row: any = await customer.createCustomer();

    if (row.error) {
      res.status(400).json({
        message: row.error,
        data: row,
      });
      return;
    }

    res.status(201).json({
      message: 'Successfully created',
      data: row,
    });
  };

  // get all customer - for admin
  static getCustomers = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.session.user == undefined) {
      res.status(403).json({
        message: 'Please login first',
      });
      return;
    }
    if (req.session.user && req.session.user.admin == false) {
      res.status(403).json({
        message: 'Only admin can access customers detail',
      });
      return;
    }

    const data = await Customer.getAllCustomerData();
    res.status(200).json({
      length: data.length,
      data,
    });
  };

  static updateCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const { name, email, current_password, new_password } = req.body;

    if (id == undefined || id.length == 0) {
      res.status(400).json({ message: 'Please provide your id ' });
      return;
    }

    if (isNaN(parseInt(id as string))) {
      res.status(400).json({ message: 'Id must be a number' });
      return;
    }

    if (!req.session.user) {
      res.status(400).json({ message: 'Please login first' });
      return;
    }

    if (id != req.session.user?.id) {
      res.status(400).json({ message: 'User can only their own profile' });
      return;
    }

    if ((name == undefined || email == undefined) && (current_password == undefined || new_password == undefined)) {
      res.status(400).json({ message: 'Please provide name and email OR current password and new password' });
      return;
    }

    if ((name != undefined || email != undefined) && (current_password != undefined || new_password != undefined)) {
      res.status(400).json({ message: 'Please choose whether to update name and email OR current password and new password' });
      return;
    }

    // update customer name and email
    if (name != undefined && email != undefined) {
      if (name.length == 0 || email.length == 0) {
        res.status(400).json({ message: 'Please provide name and email' });
        return;
      }

      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        res.status(400).json({ message: 'Email is invalid' });
        return;
      }

      const success = await Customer.updateCustomer(parseInt(id as string), name, email);

      if (success) {
        req.session.user = {
          id: req.session.user.id,
          name: name,
          email: email,
          admin: true,
        };

        await req.session.save();

        res.status(200).json({ message: 'Successfully updated' });
        return;
      }

      res.status(500).json({ message: 'Cannot update name and email' });
    }

    // update customer password
    if (current_password != undefined && new_password != undefined) {
      if (current_password.length == 0 || new_password.length == 0) {
        res.status(200).json({ message: 'Please provide current password and new password' });
        return;
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(new_password)) {
        res.status(400).json({
          message: 'Password must be at least 8 length, including lowercase, uppercase, number and special character!',
        });
        return;
      }

      const modelRes = await Customer.updateCustomerPassword(parseInt(id as string), current_password, new_password);

      if (!modelRes.success) {
        res.status(400).json({ message: modelRes.cause });
        return;
      }

      res.status(200).json({
        message: 'Successfully update',
        type: 'Password',
      });
    }
  };

  static validateEmail = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body;
    const customer = new Customer('', email, '');
    const validate = await customer.validate();

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
  };
}
