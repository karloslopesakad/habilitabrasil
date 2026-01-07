import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Desabilitar body parsing padrão do Next.js para webhooks
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Usar service role key se disponível, senão usar anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  if (!stripe) {
    console.error('Stripe não está configurado');
    return NextResponse.json(
      { error: 'Stripe não configurado' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // Processar eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const packageId = session.metadata?.package_id;

  if (!userId || !packageId) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  // Buscar pacote
  const { data: packageData, error: packageError } = await supabaseAdmin
    .from('packages')
    .select('*')
    .eq('id', packageId)
    .single();

  if (packageError || !packageData) {
    console.error('Package not found:', packageId);
    return;
  }

  const amount = session.amount_total ? session.amount_total / 100 : Number(packageData.price);

  // Criar registro de pagamento
  const { data: payment, error: paymentError } = await supabaseAdmin
    .from('payments')
    .insert({
      user_id: userId,
      package_id: packageId,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      amount: amount,
      currency: session.currency || 'brl',
      status: 'succeeded',
      metadata: {
        customer_email: session.customer_email,
        customer_details: session.customer_details,
      },
    })
    .select()
    .single();

  if (paymentError) {
    console.error('Error creating payment record:', paymentError);
    return;
  }

  // Desativar pacotes anteriores do usuário
  await supabaseAdmin
    .from('user_packages')
    .update({ status: 'expired' })
    .eq('user_id', userId)
    .eq('status', 'active');

  // Criar ou atualizar user_package
  const { error: userPackageError } = await supabaseAdmin
    .from('user_packages')
    .insert({
      user_id: userId,
      package_id: packageId,
      status: 'active',
      payment_id: payment.id,
      purchased_at: new Date().toISOString(),
      practical_hours_used: 0,
      theoretical_classes_used: 0,
      simulations_used: 0,
    });

  if (userPackageError) {
    console.error('Error creating user package:', userPackageError);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Atualizar status do pagamento se já existe
  await supabaseAdmin
    .from('payments')
    .update({
      status: 'succeeded',
      stripe_payment_intent_id: paymentIntent.id,
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Atualizar status do pagamento
  await supabaseAdmin
    .from('payments')
    .update({
      status: 'failed',
      stripe_payment_intent_id: paymentIntent.id,
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}
