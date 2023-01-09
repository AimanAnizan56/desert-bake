import { makeQuery } from '../lib/mysql_config';

export default class Payment {
  private payment_id!: string;
  private payment_status!: string;
  private payment_date!: string;
  private payment_total!: number;
  private order_id!: number;

  setPayment = (payment_id: string, payment_status: string, payment_date: string, payment_total: number, order_id: number) => {
    this.payment_id = payment_id;
    this.payment_status = payment_status;
    this.payment_date = payment_date;
    this.payment_total = payment_total;
    this.order_id = order_id;
  };

  createPayment = async () => {
    const row: any = await makeQuery('INSERT INTO payment VALUES (?,?,?,?,?)', [this.payment_id, this.payment_status, this.payment_date, this.payment_total, this.order_id]);

    if (row.affectedRows == 1) {
      return true;
    }

    return false;
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
