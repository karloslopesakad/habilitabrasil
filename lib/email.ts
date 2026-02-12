import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface PaymentNotificationParams {
  adminEmail: string;
  userName: string;
  userEmail: string;
  packageName: string;
  amount: number;
  currency?: string;
  paymentId: string;
  paymentMethod?: string;
  installments?: number;
}

export async function sendPaymentNotification({
  adminEmail,
  userName,
  userEmail,
  packageName,
  amount,
  currency = 'BRL',
  paymentId,
  paymentMethod,
  installments,
}: PaymentNotificationParams) {
  if (!resend) {
    console.warn('[Email] Resend não configurado - RESEND_API_KEY ausente');
    return;
  }

  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);

  const installmentInfo = installments && installments > 1
    ? `<p><strong>Parcelas:</strong> ${installments}x de ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency.toUpperCase(),
      }).format(amount / installments)}</p>`
    : '';

  const paymentMethodLabel = paymentMethod === 'credit_card' ? 'Cartão de Crédito'
    : paymentMethod === 'debit_card' ? 'Cartão de Débito'
    : paymentMethod === 'pix' ? 'PIX'
    : paymentMethod === 'bolbradesco' || paymentMethod === 'ticket' ? 'Boleto'
    : paymentMethod || 'N/A';

  try {
    const { data, error } = await resend.emails.send({
      from: 'FastCNH <onboarding@resend.dev>',
      to: adminEmail,
      subject: `💰 Novo pagamento aprovado - ${packageName} - ${formattedAmount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">💰 Novo Pagamento Recebido</h1>
          </div>
          
          <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Cliente</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1e3a5f;">${userName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; color: #374151;">${userEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pacote</td>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">${packageName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Valor</td>
                <td style="padding: 8px 0; font-weight: bold; font-size: 18px; color: #2563eb;">${formattedAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Método</td>
                <td style="padding: 8px 0; color: #374151;">${paymentMethodLabel}</td>
              </tr>
              ${installments && installments > 1 ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Parcelas</td>
                <td style="padding: 8px 0; color: #374151;">${installments}x</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">ID Pagamento</td>
                <td style="padding: 8px 0; font-family: monospace; font-size: 12px; color: #6b7280;">${paymentId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Data</td>
                <td style="padding: 8px 0; color: #374151;">${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
              </tr>
            </table>

            <div style="margin-top: 24px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/pagamentos" 
                 style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Ver no Painel Admin
              </a>
            </div>
          </div>
          
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
            FastCNH - Notificação automática de pagamento
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Email] Erro ao enviar notificação:', error);
    } else {
      console.log('[Email] Notificação de pagamento enviada:', data?.id);
    }
  } catch (error) {
    console.error('[Email] Erro ao enviar notificação:', error);
  }
}

