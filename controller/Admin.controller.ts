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
        message: 'Email or password field is empty',
      });
      return;
    }

    const data = await Admin.getAdminData(email, password);

    if (data.length == 0) {
      res.status(401).json({ error: true, message: 'Login failed' });
      return;
    }

    // todo - change better response
    res.status(200).json({
      message: `hello ${email}`,
      data: data,
    });
  };
}
