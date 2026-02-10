import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createPaymentPreference } from '@/lib/mercadopago';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { package_id } = await request.json();

    if (!package_id) {
      return NextResponse.json(
        { error: 'package_id é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar autenticação
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.delete(name);
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar pacote e perfil do usuário
    const [packageResult, profileResult] = await Promise.all([
      supabase
        .from('packages')
        .select('*')
        .eq('id', package_id)
        .eq('is_active', true)
        .single(),
      supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single(),
    ]);

    const { data: packageData, error: packageError } = packageResult;
    const { data: profileData } = profileResult;

    if (packageError || !packageData) {
      return NextResponse.json(
        { error: 'Pacote não encontrado ou inativo' },
        { status: 404 }
      );
    }

    // Extrair primeiro e último nome do perfil
    let firstName = '';
    let lastName = '';
    if (profileData?.name) {
      const nameParts = profileData.name.trim().split(/\s+/);
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    // Validar se Mercado Pago está configurado
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Mercado Pago não está configurado' },
        { status: 500 }
      );
    }

    // Criar preferência de pagamento
    const baseUrl = request.nextUrl.origin;
    const preference = await createPaymentPreference({
      packageId: packageData.id,
      packageName: packageData.name,
      packagePrice: Number(packageData.price),
      userId: user.id,
      userEmail: user.email!,
      firstName: firstName,
      lastName: lastName,
      successUrl: `${baseUrl}/checkout/success`,
      cancelUrl: `${baseUrl}/checkout/cancel?package_id=${package_id}`,
      failureUrl: `${baseUrl}/checkout/cancel?package_id=${package_id}`,
      pendingUrl: `${baseUrl}/checkout/pending`,
    });

    // Retornar URL de pagamento (usa sandbox_init_point em desenvolvimento, init_point em produção)
    const paymentUrl = process.env.NODE_ENV === 'production' 
      ? preference.init_point 
      : preference.sandbox_init_point || preference.init_point;

    return NextResponse.json({ url: paymentUrl, preference_id: preference.id });
  } catch (error: any) {
    console.error('Erro ao criar preferência de pagamento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
