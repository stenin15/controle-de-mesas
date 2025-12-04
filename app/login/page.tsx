'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    console.log('='.repeat(50));
    console.log('🔵 [LOGIN FRONTEND] Iniciando processo de login...');
    console.log('='.repeat(50));
    console.log('🔵 [LOGIN] Email:', email);
    console.log('🔵 [LOGIN] Senha preenchida?', !!senha);
    console.log('🔵 [LOGIN] Timestamp:', new Date().toISOString());

    try {
      console.log('🔵 [LOGIN] Preparando requisição fetch...');
      console.log('🔵 [LOGIN] URL:', '/api/auth/login');
      console.log('🔵 [LOGIN] Method: POST');
      console.log('🔵 [LOGIN] Credentials: include');
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
        credentials: 'include',
      });
      
      console.log('🔵 [LOGIN] Requisição enviada - aguardando resposta...');

      console.log('🔵 [LOGIN] Resposta recebida do servidor!');
      console.log('🔵 [LOGIN] Status:', res.status);
      console.log('🔵 [LOGIN] OK?', res.ok);
      console.log('🔵 [LOGIN] Status Text:', res.statusText);
      console.log('🔵 [LOGIN] Headers:', {
        contentType: res.headers.get('content-type'),
        setCookie: res.headers.get('set-cookie') ? 'Cookie definido' : 'Sem cookie'
      });

      // Ler JSON da resposta (apenas uma vez)
      console.log('🔵 [LOGIN] Iniciando parse do JSON da resposta...');
      let data;
      try {
        data = await res.json();
        console.log('✅ [LOGIN] JSON parseado com sucesso!');
      } catch (jsonError: any) {
        console.error('🔴 [LOGIN] ERRO ao parsear JSON:', jsonError);
        console.error('🔴 [LOGIN] Tipo do erro:', jsonError.name);
        console.error('🔴 [LOGIN] Mensagem do erro:', jsonError.message);
        setErro('Erro ao processar resposta do servidor');
        setLoading(false);
        return;
      }

      console.log('🔵 [LOGIN] Análise dos dados recebidos:');
      console.log('   - Tem message?', !!data.message);
      console.log('   - Tem user?', !!data.user);
      console.log('   - Tem error?', !!data.error);
      if (data.user) {
        console.log('   - User ID:', data.user.id);
        console.log('   - User Email:', data.user.email);
        console.log('   - User Role:', data.user.role);
        console.log('   - User Nome:', data.user.nome);
      }
      if (data.error) {
        console.log('   - Error:', data.error);
      }

      // Verificar erro explícito na resposta OU status não OK
      if (!res.ok || data.error) {
        console.error('='.repeat(50));
        console.error('🔴 [LOGIN] ERRO NA AUTENTICAÇÃO DETECTADO!');
        console.error('='.repeat(50));
        console.error('🔴 [LOGIN] Status HTTP:', res.status);
        console.error('🔴 [LOGIN] Res OK?', res.ok);
        console.error('🔴 [LOGIN] Erro na resposta:', data.error);
        console.error('🔴 [LOGIN] Dados completos:', data);
        console.error('='.repeat(50));
        setErro(data.error || 'Erro ao fazer login');
        setLoading(false);
        return;
      }

      // Verificar se recebemos dados de sucesso
      if (!data.user) {
        console.error('🔴 [LOGIN] Resposta sem usuário:', data);
        setErro('Erro: resposta do servidor inválida');
        setLoading(false);
        return;
      }

      // Verificar se o usuário tem role
      const role = data.user.role;
      if (!role || (role !== 'admin' && role !== 'funcionario')) {
        console.error('🔴 [LOGIN] Role inválido:', role);
        setErro('Erro: role do usuário inválido');
        setLoading(false);
        return;
      }

      console.log('='.repeat(50));
      console.log('✅ [LOGIN] LOGIN BEM-SUCEDIDO!');
      console.log('='.repeat(50));
      console.log('✅ [LOGIN] Usuário autenticado:', data.user.nome);
      console.log('✅ [LOGIN] Role:', role);
      console.log('✅ [LOGIN] Email:', data.user.email);
      console.log('✅ [LOGIN] ID:', data.user.id);
      
      // Aguardar processamento do cookie pelo navegador
      console.log('⏳ [LOGIN] Aguardando 300ms para processamento do cookie...');
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('✅ [LOGIN] Tempo de espera concluído');

      // Redirecionar baseado no role
      const redirectPath = role === 'admin' ? '/admin' : '/funcionario';
      console.log('🔵 [LOGIN] Preparando redirecionamento...');
      console.log('🔵 [LOGIN] Path de destino:', redirectPath);
      console.log('🔵 [LOGIN] Usando window.location.href para reload completo');
      console.log('='.repeat(50));

      // Usar window.location.href para forçar reload completo
      // Isso garante que o middleware leia o cookie na próxima requisição
      window.location.href = redirectPath;

    } catch (error: any) {
      console.error('='.repeat(50));
      console.error('🔴 [LOGIN] ERRO CAPTURADO NO CATCH!');
      console.error('='.repeat(50));
      console.error('🔴 [LOGIN] Tipo do erro:', error?.name || 'Desconhecido');
      console.error('🔴 [LOGIN] Mensagem:', error?.message || 'Sem mensagem');
      console.error('🔴 [LOGIN] Stack:', error?.stack || 'Sem stack');
      console.error('🔴 [LOGIN] Erro completo:', error);
      console.error('='.repeat(50));
      setErro('Erro ao conectar com o servidor. Verifique sua conexão.');
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h1 className="text-xl font-bold mb-4 text-center">Login</h1>

        {erro && (
          <p className="text-red-600 text-sm mb-2">{erro}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border rounded px-3 py-2 mb-3"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
