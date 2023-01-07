import { NextApiRequest, NextApiResponse } from 'next';
import Order from '../model/Order.model';

export class PaymentController {
  static createPaymentIntent = async (req: NextApiRequest, res: NextApiResponse) => {
    const { amount } = req.body;

    if (req.session.user == undefined) {
      res.status(403).json({
        message: 'Please login first',
      });
      return;
    }
    if (req.session.user && req.session.user.admin == true) {
      res.status(403).json({
        message: 'Please login as customer',
      });
      return;
    }

    if (amount == undefined || amount == '') {
      res.status(400).json({
        message: 'Please provide amount',
      });
      return;
    }

    if (isNaN(amount)) {
      res.status(400).json({
        message: 'Amount must be a number',
      });
      return;
    }

    if (parseFloat(amount) < 2) {
      res.status(400).json({
        message: 'Amount must be at least RM 2.00 above',
      });
      return;
    }

    const realAmount = amount * 100;
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: realAmount,
      currency: 'myr',
      payment_method_types: ['card'],
      receipt_emai: req.session.user.email,
      customer: req.session.user.id,
    });

    console.log('====================================');
    console.log('Payment Intent');
    console.log(paymentIntent);
    console.log('====================================');

    res.status(200).json({
      client_secret: paymentIntent.client_secret,
    });
  };

  static getPayments = async (req: NextApiRequest, res: NextApiResponse) => {
    // get payment
    const cart_id = req.query['cart-id'];

    if (cart_id == undefined) {
      await this.getAllPayments(req, res);
      return;
    }

    if (cart_id != undefined) {
      if (cart_id == '') {
        res.status(400).json({
          message: 'Please include value for cart-id',
        });
        return;
      }

      if (isNaN(parseInt(cart_id as string))) {
        res.status(400).json({
          message: 'Cart-id must be a number',
        });
        return;
      }

      await this.getPaymentByCartId(req, res);
    }
  };

  private static getAllPayments = async (req: NextApiRequest, res: NextApiResponse) => {
    // get all payments -- for admin
  };
  private static getPaymentByCartId = async (req: NextApiRequest, res: NextApiResponse) => {
    // get payment by cart id
    // step 1 - get order id by cart id
    const cart_id: number = parseInt(req.query['cart-id'] as string);

    const { order_id, message } = await Order.getOrderIdByCartId(cart_id);

    if (order_id == undefined && message == 'No order id found') {
      res.status(500).json({
        message: 'No order id found with current cart-id',
      });
      return;
    }

    // step 2 - get payment id by order id (if not exist, create one)
    // step 3 - return client secret (stripe payment id)
  };
}
