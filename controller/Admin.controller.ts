import { NextApiRequest } from 'next';
import Admin from '../model/Admin.model';

export default class AdminController {
  static login = async (req: NextApiRequest) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: {
          error: true,
          message: 'Email or password field is empty',
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

    const data = await Admin.getAdmin(email, password);

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
      id: data.admin_id,
      name: data.admin_name,
      email: data.admin_email,
      admin: true,
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
        body: {
          logout: true,
          message: 'Logout success',
        },
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

  static updateAdmin = (req: NextApiRequest) => {
    // todo -- update admin profile
  };
}
