import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

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

interface MercadoPagoWebhookData {
  type: string;
  data: {
    id: string;
  };
}

/**
 * Verifica a assinatura HMAC do webhook do Mercado Pago
 * Conforme documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/payment-notifications
 */
function verifyWebhookSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string | null,
  secret: string
): boolean {
  if (!xSignature || !xRequestId || !dataId) {
    console.error('[Mercado Pago Webhook] Headers ou query params faltando');
    return false;
  }

  // Separar x-signature em partes (formato: ts=1234567890,v1=hash)
  const parts = xSignature.split(',');
  let ts = '';
  let hash = '';

  for (const part of parts) {
    const [key, value] = part.split('=').map(s => s.trim());
    if (key === 'ts') {
      ts = value;
    } else if (key === 'v1') {
      hash = value;
    }
  }

  if (!ts || !hash) {
    console.error('[Mercado Pago Webhook] ts ou v1 não encontrados no x-signature');
    return false;
  }

  // Gerar manifest string conforme documentação
  // Formato: id:{data.id};request-id:{x-request-id};ts:{ts};
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  // Gerar HMAC SHA256
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);
  const calculatedHash = hmac.digest('hex');

  // Comparar hashes
  const isValid = calculatedHash === hash;

  if (!isValid) {
    console.error('[Mercado Pago Webhook] Verificação HMAC falhou', {
      calculated: calculatedHash,
      received: hash,
      manifest,
    });
  }

  return isValid;
}

export async function POST(request: NextRequest) {
  try {
    // Ler headers necessários para verificação HMAC
    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');

    // Ler data.id dos query params (conforme documentação)
    const { searchParams } = new URL(request.url);
    const dataId = searchParams.get('data.id');

    // Ler body para obter type
    const body = await request.json() as MercadoPagoWebhookData;

    console.log('[Mercado Pago Webhook] Evento recebido:', {
      type: body.type,
      dataId: dataId || body.data?.id,
      xRequestId,
    });

    // Verificar assinatura HMAC se a secret key estiver configurada
    // Em desenvolvimento/teste, podemos pular a verificação se não houver secret
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (webhookSecret) {
      // Usar dataId dos query params se disponível, senão usar do body
      const paymentId = dataId || body.data?.id;
      
      if (!verifyWebhookSignature(xSignature, xRequestId, paymentId, webhookSecret)) {
        console.error('[Mercado Pago Webhook] Verificação de assinatura falhou');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
      console.log('[Mercado Pago Webhook] Assinatura verificada com sucesso');
    } else {
      console.warn('[Mercado Pago Webhook] MERCADOPAGO_WEBHOOK_SECRET não configurado - pulando verificação');
    }

    // Processar diferentes tipos de eventos
    const paymentId = dataId || body.data?.id;
    
    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID não encontrado' },
        { status: 400 }
      );
    }

    switch (body.type) {
      case 'payment': {
        await handlePayment(paymentId);
        break;
      }

      case 'merchant_order': {
        await handleMerchantOrder(paymentId);
        break;
      }

      default:
        console.log(`[Mercado Pago Webhook] Tipo de evento não tratado: ${body.type}`);
    }

    // Retornar 200 OK conforme documentação (resposta em até 22 segundos)
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('[Mercado Pago Webhook] Erro ao processar:', error);
    // Em caso de erro, ainda retornar 200 para evitar retries desnecessários
    // O Mercado Pago vai reenviar a notificação se necessário
    return NextResponse.json(
      { error: error.message || 'Erro ao processar webhook' },
      { status: 200 }
    );
  }
}

async function handlePayment(paymentId: string) {
  try {
    // Buscar informações do pagamento via API do Mercado Pago
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error('[Mercado Pago Webhook] Access Token não configurado');
      return;
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[Mercado Pago Webhook] Erro ao buscar pagamento:', response.statusText);
      return;
    }

    const payment = await response.json();

    // Extrair user_id e package_id do external_reference
    // Formato: userId_packageId_timestamp
    const externalRef = payment.external_reference || '';
    const [userId, packageId] = externalRef.split('_');

    if (!userId || !packageId) {
      console.error('[Mercado Pago Webhook] External reference inválido:', externalRef);
      return;
    }

    // Mapear status do Mercado Pago para nosso status
    let status: 'succeeded' | 'pending' | 'failed' | 'refunded' = 'pending';
    if (payment.status === 'approved') {
      status = 'succeeded';
    } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
      status = 'failed';
    } else if (payment.status === 'refunded') {
      status = 'refunded';
    }

    // Buscar pagamento existente
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('mercadopago_payment_id', paymentId)
      .single();

    const paymentData = {
      user_id: userId,
      package_id: packageId,
      mercadopago_payment_id: paymentId,
      mercadopago_preference_id: payment.preference_id || null,
      amount: payment.transaction_amount || 0,
      currency: payment.currency_id || 'BRL',
      status: status,
      metadata: {
        payment_method_id: payment.payment_method_id,
        payment_type_id: payment.payment_type_id,
        installments: payment.installments,
        status_detail: payment.status_detail,
        date_approved: payment.date_approved,
        date_created: payment.date_created,
        payer: payment.payer,
      },
      updated_at: new Date().toISOString(),
    };

    if (existingPayment) {
      // Atualizar pagamento existente
      await supabaseAdmin
        .from('payments')
        .update(paymentData)
        .eq('id', existingPayment.id);
    } else {
      // Criar novo pagamento
      const { data: newPayment, error: insertError } = await supabaseAdmin
        .from('payments')
        .insert({
          ...paymentData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('[Mercado Pago Webhook] Erro ao criar pagamento:', insertError);
        return;
      }

      // Se o pagamento foi aprovado, ativar o pacote do usuário
      if (status === 'succeeded' && newPayment) {
        // Desativar pacotes anteriores
        await supabaseAdmin
          .from('user_packages')
          .update({ status: 'expired' })
          .eq('user_id', userId)
          .eq('status', 'active');

        // Criar novo user_package
        await supabaseAdmin
          .from('user_packages')
          .insert({
            user_id: userId,
            package_id: packageId,
            status: 'active',
            payment_id: newPayment.id,
            purchased_at: new Date().toISOString(),
            practical_hours_used: 0,
            theoretical_classes_used: 0,
            simulations_used: 0,
          });
      }
    }

    console.log('[Mercado Pago Webhook] Pagamento processado com sucesso:', paymentId);
  } catch (error: any) {
    console.error('[Mercado Pago Webhook] Erro ao processar pagamento:', error);
  }
}

async function handleMerchantOrder(orderId: string) {
  try {
    console.log('[Mercado Pago Webhook] Merchant Order recebido:', orderId);
    
    // Buscar informações do merchant order via API do Mercado Pago
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error('[Mercado Pago Webhook] Access Token não configurado');
      return;
    }

    const response = await fetch(`https://api.mercadopago.com/merchant_orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[Mercado Pago Webhook] Erro ao buscar merchant order:', response.statusText);
      return;
    }

    const order = await response.json();

    // O merchant order pode conter múltiplos pagamentos
    // Processar cada pagamento associado ao pedido
    if (order.payments && Array.isArray(order.payments)) {
      for (const paymentInfo of order.payments) {
        if (paymentInfo.id) {
          console.log('[Mercado Pago Webhook] Processando pagamento do merchant order:', paymentInfo.id);
          await handlePayment(paymentInfo.id);
        }
      }
    }

    console.log('[Mercado Pago Webhook] Merchant Order processado com sucesso:', orderId);
  } catch (error: any) {
    console.error('[Mercado Pago Webhook] Erro ao processar merchant order:', error);
  }
}

