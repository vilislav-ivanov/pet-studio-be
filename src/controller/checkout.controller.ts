import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getCart } from '../service/cart.service';
import config from 'config';

const stripePublicKey = config.get<string>('stripePublicKey');
const stripePrivateKey = config.get<string>('stripePrivateKey');

const stripe = new Stripe(stripePrivateKey, {
  apiVersion: '2022-11-15',
});

export async function getPublicKeySessionHandler(req: Request, res: Response) {
  return res.json({ public_key: stripePublicKey });
}

export async function createCheckoutSessionHandler(
  req: Request<{}, {}, { email: string }, {}>,
  res: Response
) {
  const cartId = req.cookies.csid as string;
  if (!cartId) {
    return res.sendStatus(403);
  }
  const cart = await getCart(cartId);
  const price = cart?.price || 0;
  const paymentIntend = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    receipt_email: req.body.email,
  });

  res.json({ client_secret: paymentIntend['client_secret'] });
}
