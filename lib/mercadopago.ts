import { MercadoPagoConfig, Preference } from 'mercadopago';

// Inicializar cliente do Mercado Pago
export const mercadoPagoClient = process.env.MERCADOPAGO_ACCESS_TOKEN
  ? new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: {
        timeout: 5000,
        // Não definir idempotencyKey fixo - deixar o SDK gerar automaticamente
      },
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

  // Validar que successUrl está definido
  if (!successUrl || successUrl.trim() === '') {
    throw new Error('successUrl é obrigatório para criar preferência de pagamento');
  }

  // Garantir que todas as URLs estão definidas
  const backUrls = {
    success: successUrl,
    failure: failureUrl || cancelUrl,
    pending: pendingUrl || cancelUrl,
  };

  console.log('[Mercado Pago] URLs configuradas:', backUrls);

  const preference = new Preference(mercadoPagoClient);

  // Construir body da preferência
  const preferenceBody: any = {
    items: [
      {
        id: packageId.substring(0, 256), // Limitar tamanho do ID
        title: packageName.substring(0, 256), // Limitar tamanho do título
        description: `Pacote ${packageName} - FastCNH`.substring(0, 500), // Limitar descrição
        quantity: 1,
        unit_price: Number(packagePrice), // Garantir que é número
        currency_id: 'BRL',
        category_id: 'education', // Categoria para melhorar aprovação (conforme checklist)
      },
    ],
    payer: {
      email: userEmail,
      ...(firstName && { first_name: firstName.substring(0, 50) }),
      ...(lastName && { last_name: lastName.substring(0, 50) }),
    },
    back_urls: backUrls,
    statement_descriptor: 'FastCNH'.substring(0, 22), // Limite de 22 caracteres
    // Habilitar parcelamento no cartão de crédito (até 12x)
    // O Mercado Pago oferece parcelamento nativo para cartões de crédito
    payment_methods: {
      installments: 12, // Número máximo de parcelas disponíveis
      // NÃO incluir excluded_payment_methods ou excluded_payment_types
      // Arrays vazios ou com strings vazias causam erro payment_creation_failed
    },
    // Metadata para identificar o pagamento
    metadata: {
      user_id: userId,
      package_id: packageId,
    },
    // Configurações adicionais
    external_reference: `${userId}_${packageId}_${Date.now()}`,
  };

  // Limpar o body antes de enviar - remover campos undefined/null/vazios
  // Isso evita que o SDK adicione campos inválidos automaticamente
  // Especialmente importante: remover excluded_payment_methods e excluded_payment_types
  // quando estão vazios ou contêm apenas strings vazias
  const cleanBody = (obj: any): any => {
    if (Array.isArray(obj)) {
      // Filtrar strings vazias e valores inválidos
      const filtered = obj.map(cleanBody).filter(item => {
        return item !== null && item !== undefined && item !== '';
      });
      // Se o array ficou vazio após filtrar, retornar undefined para não incluir
      return filtered.length > 0 ? filtered : undefined;
    } else if (obj !== null && typeof obj === 'object') {
      const cleaned: any = {};
      for (const key in obj) {
        const value = cleanBody(obj[key]);
        // Não incluir se for undefined (removido pela limpeza)
        if (value !== undefined) {
          if (Array.isArray(value)) {
            // Não incluir arrays vazios ou com apenas strings vazias
            const validItems = value.filter(item => item !== '' && item !== null && item !== undefined);
            if (validItems.length > 0) {
              cleaned[key] = validItems;
            }
          } else if (typeof value === 'object' && value !== null) {
            // Não incluir objetos vazios
            if (Object.keys(value).length > 0) {
              cleaned[key] = value;
            }
          } else if (value !== null && value !== '') {
            cleaned[key] = value;
          }
        }
      }
      return cleaned;
    }
    return obj;
  };

  const cleanedBody = cleanBody(preferenceBody);

  // Limpeza específica para payment_methods - garantir que excluded_payment_methods
  // e excluded_payment_types sejam completamente removidos se vazios
  if (cleanedBody.payment_methods) {
    // Remover excluded_payment_methods se estiver vazio ou com strings vazias
    if (cleanedBody.payment_methods.excluded_payment_methods) {
      const validExcluded = cleanedBody.payment_methods.excluded_payment_methods.filter(
        (item: string) => item && typeof item === 'string' && item.trim() !== ''
      );
      if (validExcluded.length === 0) {
        delete cleanedBody.payment_methods.excluded_payment_methods;
      } else {
        cleanedBody.payment_methods.excluded_payment_methods = validExcluded;
      }
    }
    
    // Remover excluded_payment_types se estiver vazio ou com strings vazias
    if (cleanedBody.payment_methods.excluded_payment_types) {
      const validExcluded = cleanedBody.payment_methods.excluded_payment_types.filter(
        (item: string) => item && typeof item === 'string' && item.trim() !== ''
      );
      if (validExcluded.length === 0) {
        delete cleanedBody.payment_methods.excluded_payment_types;
      } else {
        cleanedBody.payment_methods.excluded_payment_types = validExcluded;
      }
    }
  }

  // Adicionar notification_url apenas se NEXT_PUBLIC_APP_URL estiver definido
  if (process.env.NEXT_PUBLIC_APP_URL) {
    cleanedBody.notification_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook/mercadopago`;
  }

  // O Mercado Pago tem problemas com auto_return em ambiente de desenvolvimento (localhost)
  // e também pode ter bugs no SDK. Vamos desabilitar por enquanto.
  // O usuário será redirecionado manualmente após o pagamento.
  // Para habilitar auto_return em produção, descomente a linha abaixo:
  // if (process.env.NODE_ENV === 'production' && backUrls.success && backUrls.failure && backUrls.pending) {
  //   preferenceBody.auto_return = 'approved';
  // }

  console.log('[Mercado Pago] Criando preferência com body:', JSON.stringify(cleanedBody, null, 2));

  const response = await preference.create({
    body: cleanedBody,
  });

  console.log('[Mercado Pago] Preferência criada:', {
    id: response.id,
    init_point: response.init_point,
    sandbox_init_point: response.sandbox_init_point,
  });

  return response;
}

