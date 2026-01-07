import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  : null;

export interface CreateCheckoutSessionParams {
  packageId: string;
  packageName: string;
  packagePrice: number;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession({
  packageId,
  packageName,
  packagePrice,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  if (!stripe) {
    throw new Error('Stripe não está configurado. Verifique STRIPE_SECRET_KEY.');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: packageName,
            description: `Pacote ${packageName} - HabilitaBrasil`,
          },
          unit_amount: Math.round(packagePrice * 100), // Converter para centavos
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    metadata: {
      user_id: userId,
      package_id: packageId,
    },
  });

  return session;
}
