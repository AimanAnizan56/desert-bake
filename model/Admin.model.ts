import { hashPassword } from '../lib/helper';
import { makeQuery } from '../lib/mysql_config';

export default class Admin {
  private readonly id!: number;
  private name: string;
  private email: string;
  private password!: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = hashPassword(password);
  }

  static getAdmin = async (email: string, password: string) => {
    const passwordHashed = hashPassword(password);
    const data = await makeQuery('SELECT admin_id, admin_name, admin_email FROM admin WHERE admin_email=? AND password=?', [email, passwordHashed]);

    if (data.length == 0) {
      return [];
    }
    return data[0];
  };
}
