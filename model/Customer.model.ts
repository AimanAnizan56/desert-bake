import { hashPassword } from '../lib/helper';

export class Customer {
  private readonly id!: number;
  private name: string;
  private email: string;
  private password!: any;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = hashPassword(password);
  }
}
