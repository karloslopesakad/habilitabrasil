import { MercadoPagoConfig, Preference } from 'mercadopago';

// Inicializar cliente do Mercado Pago
export const mercadoPagoClient = process.env.MERCADOPAGO_ACCESS_TOKEN
  ? new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    })
  : null;

export interface CreatePaymentPreferenceParams {
  packageId: string;
  packageName: string;
  packagePrice: number;
  userId: string;
  userEmail: string;
  firstName?: string;
  lastName?: string;
  successUrl: string;
  cancelUrl: string;
  failureUrl?: string;
  pendingUrl?: string;
}

export async function createPaymentPreference({
  packageId,
  packageName,
  packagePrice,
  userId,
  userEmail,
  firstName,
  lastName,
  successUrl,
  cancelUrl,
  failureUrl,
  pendingUrl,
}: CreatePaymentPreferenceParams) {
  if (!mercadoPagoClient) {
    throw new Error('Mercado Pago não está configurado. Verifique MERCADOPAGO_ACCESS_TOKEN.');
  }

  if (!successUrl || successUrl.trim() === '') {
    throw new Error('successUrl é obrigatório para criar preferência de pagamento');
  }

  const preference = new Preference(mercadoPagoClient);

  // Body MINIMALISTA conforme documentação oficial do Checkout Pro
  // https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/create-payment-preference#editor_3
  const body: Record<string, any> = {
    items: [
      {
        title: packageName,
        quantity: 1,
        unit_price: Number(packagePrice),
      },
    ],
    back_urls: {
      success: successUrl,
      failure: failureUrl || cancelUrl,
      pending: pendingUrl || cancelUrl,
    },
    metadata: {
      user_id: userId,
      package_id: packageId,
    },
    external_reference: `${userId}_${packageId}_${Date.now()}`,
  };

  // Adicionar dados opcionais que melhoram a aprovação
  if (userEmail) body.payer = { email: userEmail };
  if (firstName && body.payer) body.payer.first_name = firstName;
  if (lastName && body.payer) body.payer.last_name = lastName;

  // notification_url APENAS em produção com URL pública
  // Em localhost, o Mercado Pago não consegue acessar e pode causar erros
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  if (appUrl && !appUrl.includes('localhost') && !appUrl.includes('127.0.0.1')) {
    body.notification_url = `${appUrl}/api/payment/webhook/mercadopago`;
  }

  console.log('[Mercado Pago] Criando preferência com body:', JSON.stringify(body, null, 2));

  const response = await preference.create({ body: body as any });

  console.log('[Mercado Pago] Preferência criada:', {
    id: response.id,
    init_point: response.init_point,
    sandbox_init_point: response.sandbox_init_point,
  });

  return response;
}
