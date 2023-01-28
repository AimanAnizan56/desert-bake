import { NextApiRequest, NextApiResponse } from 'next';
import Admin from '../model/Admin.model';

export default class AdminController {
  static login = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: true,
        message: 'Email or password field is empty',
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

    const data = await Admin.getAdmin(email, password);

    if (data.length == 0) {
      res.status(401).json({
        error: true,

        message: 'Login failed',
      });
      return;
    }

    req.session.user = {
      id: data.admin_id,
      name: data.admin_name,
      email: data.admin_email,
      admin: true,
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
  };

  static updateAdmin = (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const { name, email, current_password, new_password } = req.body;

    if (id == undefined || id.length == 0) {
      res.status(400).json({
        message: 'Please provide id',
      });
      return;
    }

    if (isNaN(parseInt(id as string))) {
      res.status(400).json({
        message: 'Id must be a number',
      });
      return;
    }

    if (!req.session.user) {
      res.status(400).json({
        message: 'Please login first',
      });
      return;
    }

    if (id != req.session.user?.id) {
      res.status(400).json({
        message: 'User can only their own profile',
      });
      return;
    }

    if ((name == undefined || email == undefined) && (current_password == undefined || new_password == undefined)) {
      res.status(400).json({
        message: 'Please provide name and email OR current password and new password',
      });
      return;
    }

    if ((name != undefined || email != undefined) && (current_password != undefined || new_password != undefined)) {
      res.status(400).json({
        message: 'Please choose whether to update name and email OR current password and new password',
      });
      return;
    }

    res.status(400).json({
      message: 'Okay',
    });
  };
}
