import { NextApiRequest, NextApiResponse } from 'next';
import Order from '../model/Order.model';
import Payment from '../model/Payment.model';
import Item from '../model/Items.model';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

  private static createPayment = async (customer: any, order_id: number, amount: number) => {
    // (required - amount, currency)
    // optional (use metadata to store order id etc)
    const stripeAmount = amount * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: 'myr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer_id: customer.id,
        customer_email: customer.email,
        customer_name: customer.name,
        order_id: order_id,
      },
    });

    return paymentIntent;
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

    if (!req.session.user) {
      res.status(400).json({
        message: 'Please login first',
      });
      return;
    }

    if (req.session.user && req.session.user.admin) {
      res.status(400).json({
        message: 'Only customer can retrieve cart',
      });
      return;
    }

    // step 1 - get order id by cart id
    const cart_id: number = parseInt(req.query['cart-id'] as string);

    const { order_id, message } = await Order.getOrderIdByCartId(cart_id, parseInt(req.session.user.id));

    if (order_id == undefined && message == 'No order id found') {
      res.status(500).json({
        message: 'No order id found with current cart-id',
      });
      return;
    }

    // step 2 - get payment id by order id (if not exist, create one)
    let resPayment: any = await Payment.getPaymentByOrderId(order_id as number);
    let payment = undefined;
    let client_secret = undefined;

    if (resPayment.message == 'No payment found') {
      const row = await Item.getCompleteCartItemById(cart_id, parseInt(req.session.user.id));
      const amount: number = row[0].cart_total;

      // create payment intent
      const paymentIntent = await this.createPayment(req.session.user, order_id as number, amount);

      // store payment intent id in payment db
      payment = new Payment();
      // payment.setPayment(paymentIntent.id, paymentIntent.status);
      payment.setPayment(paymentIntent.id, paymentIntent.status, paymentIntent.created, paymentIntent.amount / 100, paymentIntent.metadata.order_id);
      client_secret = paymentIntent.client_secret;

      const succeed = await payment.createPayment();

      if (!succeed) {
        res.status(500).json({
          message: 'Cannot create payment',
        });
        return;
      }
    } else {
      payment = resPayment.data;
    }

    // step 3 - return client secret (stripe payment id)
    if (!(client_secret != undefined && client_secret != '')) {
      res.status(200).send('make request from stripe api to get client secret');
      return;
    }
    res.status(200).json({
      message: 'Sucess',
      data: {
        client_secret: client_secret,
      },
    });
  };
}
