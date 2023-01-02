import { makeQuery } from '../lib/mysql_config';

export default class Cart {
  private cart_id!: number;
  private cart_total!: number;
  private customer_id!: number;
  private cart_status!: string;

  setCart = (cart_id: number, cart_total: number, customer_id: number, cart_status: string) => {
    this.cart_id = cart_id;
    this.cart_total = cart_total;
    this.customer_id = customer_id;
    this.cart_status = cart_status;
  };

  setCartId = (cart_id: number) => {
    this.cart_id = cart_id;
  };

  setCustomerId = (customer_id: number) => {
    this.customer_id = customer_id;
  };

  createCartId = async () => {
    // create new cart id with current customer id
    const row: any = await makeQuery('INSERT INTO cart(customer_id) VALUES (?)', [this.customer_id]);

    if (row.affectedRows == 1) {
      return {
        cartId: row.insertId,
      };
    }
  };

  getUserCartId = async () => {
    let row: any = await makeQuery('SELECT cart_id FROM cart WHERE cart_status="in use" AND customer_id=?', [this.customer_id]);

    if (row.length > 0) {
      this.cart_id = row[0].cart_id;
      return {
        cartId: row[0].cart_id,
      };
    }

    return {
      cartId: -99,
    };
  };

  static recalculateTotal = async () => {
    const row: any = await makeQuery('UPDATE cart ct  SET cart_total = (SELECT sum(it.item_price * it.item_quantity) FROM items it WHERE it.cart_id = ct.cart_id)');

    if (row.affected > 0) {
      return true;
    }

    return false;
  };
}
