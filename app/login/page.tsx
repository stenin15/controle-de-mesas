'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha }),
      credentials: 'include',
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErro(data.error || 'Erro ao fazer login');
      return;
    }

    const data = await res.json();
    const role = data.user?.role;

    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/funcionario');
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
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border rounded px-3 py-2 mb-3"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
