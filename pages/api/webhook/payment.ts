import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { buffer } from 'micro';
import { WebhookPaymentController } from '../../../webhook/webhook.controller';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY as string);

const paymentWebhook = nextConnect({
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: true, message: 'Request method not allowed' });
  },
});

paymentWebhook.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET as string;

  let buf;
  try {
    buf = await buffer(req);
  } catch (err) {
    console.log('err here', err);
  }
  const stripe_signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, stripe_signature, endpointSecret);
    console.log('Event', event);
  } catch (err: any) {
    console.log('====================================');
    console.log(`Webhook Error: ${err.message}`);
    console.log('====================================');
    res.status(400).json({
      message: `Webhook Error: ${err.message}`,
    });
  }

  // payload.type (payment_intent.succeeded, payment_intent.canceled)
  switch (event.type) {
    case 'payment_intent.succeeded':
      await WebhookPaymentController.handleSucceeded(event, res);
      break;
    case 'payment_intent.canceled':
      await WebhookPaymentController.handleCanceled(event, res);
      break;
    case 'payment_intent.payment_failed':
      await WebhookPaymentController.handleFailed(event, res);
      break;
    default:
      res.status(400).json({
        message: `Unhandled event type ${event.type}`,
      });
      break;
  }
});

export default paymentWebhook;
