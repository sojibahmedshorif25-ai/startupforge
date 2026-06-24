import stripe from '../config/stripe.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

export const createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'StartupForge Premium - Unlimited Opportunities' },
            unit_amount: 1999,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      customer_email: req.user.email,
      metadata: { user_email: req.user.email },
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      await Payment.create({
        user_email: session.metadata.user_email,
        amount: session.amount_total / 100,
        transaction_id: session.payment_intent,
        payment_status: 'completed',
      });
      await User.findOneAndUpdate(
        { email: session.metadata.user_email },
        { isPremium: true }
      );
      res.json({ message: 'Payment successful', success: true });
    } else {
      res.json({ message: 'Payment not completed', success: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
