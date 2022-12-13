import { NextApiRequest, NextApiResponse } from 'next';
import Admin from '../model/Admin.model';

export default class AdminController {
  static login = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != 'POST') {
      res.status(405).json({ error: true, message: 'Request method not allowed' });
      return;
    }

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

    const data = await Admin.getAdminData(email, password);

    if (data.length == 0) {
      res.status(401).json({ error: true, message: 'Login failed' });
      return;
    }

    req.session.user = {
      id: data.admin_id,
      name: data.admin_name,
      email: data.admin_email,
      admin: true,
    };

    await req.session.save();
    res.status(200).json({ error: false, message: 'Login success' });
  };
}
