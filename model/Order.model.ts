import { makeQuery } from '../lib/mysql_config';

export default class Order {
  private order_id!: number;
  private order_status!: string;
  private customer_id!: number;
  private cart_id!: number;

  setOrder = (order_id: number, order_status: string, customer_id: number, cart_id: number) => {
    this.order_id = order_id;
    this.order_status = order_status;
    this.customer_id = customer_id;
    this.cart_id = this.cart_id;
  };

  setOrderStatus = (order_status: string) => {
    this.order_status = order_status;
  };

  setCustomerId = (customer_id: number) => {
    this.customer_id = customer_id;
  };

  setCartId = (cart_id: number) => {
    this.cart_id = cart_id;
  };

  getOrderId = () => {
    return this.order_id;
  };

  getOrderStatus = () => {
    return this.order_status;
  };

  getCustomerId = () => {
    return this.customer_id;
  };

  getCartId = () => {
    return this.cart_id;
  };

  createOrder = async () => {
    // create order in db
    const row = await makeQuery('INSERT INTO orders(order_status, customer_id, cart_id) VALUES (?,?,?)', [this.order_status, this.customer_id, this.cart_id]);

    if (row.affectedRows == 1) {
      this.order_id = row.insertId;
      return true;
    }

    return false;
  };
}
