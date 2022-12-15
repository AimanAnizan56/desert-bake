import { NextApiRequest, NextApiResponse } from 'next';
import { Customer } from '../model/Customer.model';

export default class CustomerController {
  static login = async (req: NextApiRequest) => {
    // POST - Authenticate user begin
    if (req.session.user != undefined) {
      return {
        statusCode: 400,
        body: { error: false, message: 'Customer has already login' },
      };
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: {
          error: true,
          message: 'Email or password is empty',
        },
      };
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return {
        statusCode: 400,
        body: {
          error: true,
          message: 'Email is invalid',
        },
      };
    }

    const data = await Customer.getCustomerData(email, password);

    if (data.length == 0) {
      return {
        statusCode: 401,
        body: {
          error: true,
          message: 'Login failed',
        },
      };
    }

    req.session.user = {
      id: data.customer_id,
      name: data.customer_name,
      email: data.customer_email,
      admin: false,
    };

    await req.session.save();
    return {
      statusCode: 200,
      body: {
        error: false,
        message: 'Login success',
      },
    };
  };

  static logout = (req: NextApiRequest) => {
    req.session.destroy();
    if (req.session.user == undefined) {
      return {
        statusCode: 200,
        body: { logout: true, message: 'Logout success' },
      };
    }

    return {
      statusCode: 500,
      body: {
        error: true,
        message: 'Logout failed',
      },
    };
  };

  // get all customer - for admin
  static getAll = async (req: NextApiRequest) => {
    // todo - check if user is admin
    const data = await Customer.getAllCustomerData();
    return {
      statusCode: 200,
      body: {
        length: data.length,
        data,
      },
    };
  };

  static create = async (req: NextApiRequest) => {
    const { name, email, password } = req.body;

    if (name == undefined || email == undefined || password == undefined || name.length == 0 || email.length == 0 || password.length == 0) {
      return {
        statusCode: 400,
        body: {
          message: 'Please provide name, email and password',
        },
      };
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
      return {
        statusCode: 400,
        body: {
          message: 'Email or password is invalid',
        },
      };
    }
    const customer = new Customer(name, email, password);

    // check if email is exist
    const validate: boolean = await customer.validate();

    if (!validate) {
      return {
        statusCode: 400,
        body: {
          message: 'Please provide another email',
        },
      };
    }

    // insert into database
    const row: any = await customer.insertDb();

    if (row.error) {
      return {
        statusCode: 400,
        body: {
          message: row.error,
          data: row,
        },
      };
    }

    return {
      statusCode: 201,
      body: {
        message: 'Successfully created',
        data: row,
      },
    };
  };
}
