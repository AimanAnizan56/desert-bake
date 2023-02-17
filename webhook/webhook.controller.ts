import { NextApiResponse } from 'next';
import { makeQuery } from '../lib/mysql_config';

export class WebhookPaymentController {
  // webhook for payment intent
  static handleSucceeded = async (event: any, res: NextApiResponse) => {
    const paymentIntent = event.data.object;

    const payment_id = paymentIntent.id;
    const payment_date = event.created;
    const status = paymentIntent.status;

    console.log('====================================');
    console.log('Payment intent data');
    console.log(`payment_id: ${payment_id}`);
    console.log(`payment_date: ${payment_date}`);
    console.log(`payment_status: ${status}`);
    console.log('====================================');

    let succeed = await WebhookPaymentQuery.updatePayment(payment_id, status, payment_date);

    if (!succeed) {
      console.log('====================================');
      console.log(`Cannot update payment id: ${payment_id}`);
      console.log('====================================');
      res.status(400).json({
        message: `Cannot update payment id: ${payment_id}`,
      });
      return;
    }
    console.log('succeed updatePayment', succeed);

    const { order_id } = paymentIntent.metadata;
    succeed = await WebhookOrderQuery.updateOrder(order_id, 'preparing');

    if (!succeed) {
      console.log('====================================');
      console.log(`Cannot update order id: ${order_id}`);
      console.log('====================================');
      res.status(400).json({
        message: `Cannot update order id: ${order_id}`,
      });
      return;
    }
    console.log('succeed updateOrder', succeed);

    res.status(200).send({
      success: true,
      message: `Payment updated`,
    });
  };

  static handleCanceled = async (charge: any, res: NextApiResponse) => {
    //
    res.status(200).json({
      message: 'handleCanceled executed',
    });
  };

  static handleFailed = async (paymentIntent: any, res: NextApiResponse) => {
    //
    res.status(200).json({
      message: 'handleFailed executed',
    });
  };
}

class WebhookPaymentQuery {
  // update payment in db
  static updatePayment = async (payment_id: string, payment_status: string, payment_date: string) => {
    const row: any = await makeQuery('UPDATE payment SET payment_status=?, payment_date=? WHERE payment_id=?', [payment_status, payment_date, payment_id]);
    console.log('====================================');
    console.log('row update payment: ');
    console.log(row);
    console.log('====================================');
    if (row.affectedRows == 1) {
      return true;
    }

    return false;
  };
}

class WebhookOrderQuery {
  //
  static updateOrder = async (order_id: string, order_status: string) => {
    const row: any = await makeQuery('UPDATE orders SET order_status=? WHERE order_id=?', [order_status, order_id]);

    if (row.affectedRows == 1) {
      return true;
    }

    return false;
  };
}
