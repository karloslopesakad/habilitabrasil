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

  // Métodos de pagamento: cartão de crédito e boleto
  const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card', 'boleto'];

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: paymentMethodTypes,
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: packageName,
            description: `Pacote ${packageName} - FastCNH`,
          },
          unit_amount: Math.round(packagePrice * 100), // Converter para centavos
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    locale: 'pt-BR',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    billing_address_collection: 'auto',
    metadata: {
      user_id: userId,
      package_id: packageId,
    },
  };

  console.log('[Stripe] Criando checkout session com configuração:', {
    currency: 'brl',
    locale: 'pt-BR',
    payment_methods: paymentMethodTypes,
    package_price: packagePrice,
  });

  const session = await stripe.checkout.sessions.create(sessionConfig);

  console.log('[Stripe] Checkout session criada:', {
    id: session.id,
    url: session.url,
    payment_method_types: session.payment_method_types,
  });

  return session;
}
