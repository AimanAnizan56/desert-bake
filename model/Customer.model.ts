import { hashPassword } from '../lib/helper';
import { makeQuery } from '../lib/mysql_config';

export default class Customer {
  private readonly id!: number;
  private name: string;
  private email: string;
  private password!: any;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = hashPassword(password);
  }

  validate = async () => {
    const row = makeQuery('SELECT customer_id FROM customer WHERE customer_email=?', [this.email]);
    const data: Array<{ customer_id: number }> = await row;

    if (data.length == 0) {
      return true;
    }
    return false;
  };

  createCustomer = async () => {
    const row = makeQuery('INSERT INTO customer(customer_name, customer_email, password) VALUES (?,?,?)', [this.name, this.email, this.password]);
    const data = await row;

    if (data.affectedRows == 1) {
      return {
        id: data.insertId,
        name: this.name,
        email: this.email,
      };
    }

    return {
      error: 'Could not create',
    };
  };

  static getAllCustomerData = async () => {
    const data = await makeQuery('SELECT customer_id, customer_name, customer_email FROM customer');

    if (data.length == 0) {
      return [];
    }
    return data;
  };

  static getCustomerData = async (email: string, password: string) => {
    const hashedPassword = hashPassword(password);
    const data = await makeQuery('SELECT customer_id, customer_name, customer_email FROM customer WHERE customer_email=? AND password=?', [email, hashedPassword]);

    if (data.length == 0) {
      return [];
    }
    return data[0];
  };

  // FOR SALES
  static getMostSpendUser = async () => {
    const row: any = await makeQuery(
      'SELECT customer.customer_id, customer_name, SUM(cart_total) as total_spend FROM customer, cart, orders WHERE customer.customer_id=cart.customer_id AND orders.customer_id = customer.customer_id AND orders.cart_id=cart.cart_id AND (orders.order_status="complete" OR orders.order_status="preparing" OR orders.order_status="ready_for_pickup") GROUP BY customer.customer_id ORDER BY total_spend DESC'
    );

    if (row.length > 0) {
      return row;
    }

    return [];
  };
}
