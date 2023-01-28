import { hashPassword } from '../lib/helper';
import { makeQuery } from '../lib/mysql_config';

export default class Admin {
  private id!: number;
  private name: string;
  private email: string;
  private password!: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = hashPassword(password);
  }

  setId = (id: number) => {
    this.id = id;
  };

  setName = (name: string) => {
    this.name = name;
  };

  setEmail = (email: string) => {
    this.email = email;
  };

  setPassword = (password: string) => {
    this.password = password;
  };

  static getAdmin = async (email: string, password: string) => {
    const passwordHashed = hashPassword(password);
    const data = await makeQuery('SELECT admin_id, admin_name, admin_email FROM admin WHERE admin_email=? AND password=?', [email, passwordHashed]);

    if (data.length == 0) {
      return [];
    }
    return data[0];
  };

  static updateAdmin = async (id: number, name: string, email: string) => {
    const query = 'UPDATE admin SET admin_name=?, admin_email=? WHERE admin_id=?';
    const data = await makeQuery(query, [name, email, id]);

    if (data.affectedRows == 1) {
      return true;
    }
    return false;
  };

  static updateAdminPassword = async (id: number, password: string) => {
    const query = 'UPDATE admin SET password=? WHERE admin_id=?';
    const data = await makeQuery(query, [password, id]);

    if (data.affectedRows == 1) {
      return true;
    }
    return false;
  };
}
