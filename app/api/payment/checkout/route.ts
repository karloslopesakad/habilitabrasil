import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createCheckoutSession } from '@/lib/stripe';
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

    // Buscar pacote
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', package_id)
      .eq('is_active', true)
      .single();

    if (packageError || !packageData) {
      return NextResponse.json(
        { error: 'Pacote não encontrado ou inativo' },
        { status: 404 }
      );
    }

    // Validar se Stripe está configurado
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe não está configurado' },
        { status: 500 }
      );
    }

    // Criar checkout session
    const baseUrl = request.nextUrl.origin;
    const session = await createCheckoutSession({
      packageId: packageData.id,
      packageName: packageData.name,
      packagePrice: Number(packageData.price),
      userId: user.id,
      userEmail: user.email!,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/checkout/cancel?package_id=${package_id}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Erro ao criar checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
