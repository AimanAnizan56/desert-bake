import { makeQuery } from '../lib/mysql_config';

export default class Payment {
  private payment_id!: string;
  private payment_status!: string;
  private payment_date!: string;
  private payment_created!: string;
  private payment_total!: number;
  private order_id!: number;

  setPayment = (payment_id: string, payment_status: string, payment_created: string, payment_total: number, order_id: number) => {
    this.payment_id = payment_id;
    this.payment_status = payment_status;
    this.payment_created = payment_created;
    this.payment_total = payment_total;
    this.order_id = order_id;
  };

  createPayment = async () => {
    const row: any = await makeQuery('INSERT INTO payment (payment_id, payment_status, payment_created, payment_total, order_id) VALUES (?,?,?,?,?)', [this.payment_id, this.payment_status, this.payment_created, this.payment_total, this.order_id]);

    if (row.affectedRows == 1) {
      return true;
    }

    return false;
  };

  getPaymentId = () => {
    return this.payment_id;
  };

  static getPaymentByOrderId = async (order_id: number) => {
    const row: any = await makeQuery('SELECT * FROM payment WHERE order_id=?', [order_id]);

    if (row.length == 0) {
      return {
        message: 'No payment found',
      };
    }

    const payment = new Payment();
    payment.setPayment(row[0].payment_id, row[0].payment_status, row[0].payment_date, row[0].payment_total, row[0].order_id);

    return {
      message: 'Payment found',
      data: payment,
    };
  };
}
