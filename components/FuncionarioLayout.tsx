'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export default function FuncionarioLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      console.log('🔵 [FuncionarioLayout] Verificando autenticação do usuário...');
      console.log('🔵 [FuncionarioLayout] Pathname atual:', pathname);
      
      try {
        console.log('🔵 [FuncionarioLayout] Fazendo requisição para /api/auth/me...');
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        
        console.log('🔵 [FuncionarioLayout] Resposta recebida:', {
          status: res.status,
          ok: res.ok,
          statusText: res.statusText
        });
        
        const data = await res.json();
        console.log('🔵 [FuncionarioLayout] Dados recebidos:', {
          hasUser: !!data.user,
          userRole: data.user?.role,
          hasError: !!data.error,
          error: data.error
        });

        if (!res.ok || !data.user) {
          console.error('🔴 [FuncionarioLayout] Acesso negado:', {
            resOk: res.ok,
            hasUser: !!data.user,
            error: data.error
          });
          console.log('🔴 [FuncionarioLayout] Redirecionando para /login...');
          router.push('/login');
          return;
        }

        console.log('✅ [FuncionarioLayout] Usuário autenticado:', {
          id: data.user.id,
          nome: data.user.nome,
          email: data.user.email,
          role: data.user.role
        });
        setUser(data.user);
      } catch (error: any) {
        console.error('🔴 [FuncionarioLayout] Erro ao verificar autenticação:', error);
        console.error('🔴 [FuncionarioLayout] Tipo do erro:', error?.name);
        console.error('🔴 [FuncionarioLayout] Mensagem:', error?.message);
        console.log('🔴 [FuncionarioLayout] Redirecionando para /login...');
        router.push('/login');
      } finally {
        console.log('🔵 [FuncionarioLayout] Finalizando verificação de autenticação');
        setLoading(false);
      }
    }

    fetchUser();
  }, [router, pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { href: '/funcionario/vender', label: 'Vender (WhatsApp)', icon: '💬' },
    { href: '/funcionario/venda-presencial', label: 'Venda Presencial', icon: '🏪' },
    { href: '/funcionario/scanner', label: 'Scanner QR', icon: '📷' },
    { href: '/funcionario/pacotes', label: 'Pacotes', icon: '🎫' },
    { href: '/funcionario/minhas-vendas', label: 'Minhas Vendas', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-white">Controle de Mesas</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? 'border-slate-500 text-white'
                        : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-slate-300 mr-4">{user.nome}</span>
              <button
                onClick={handleLogout}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}



