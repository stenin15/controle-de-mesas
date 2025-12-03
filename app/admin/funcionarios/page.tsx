'use client';

import { useEffect, useState } from "react";

export default function AdminFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    const resp = await fetch("/api/funcionarios");
    const data = await resp.json();

    if (resp.ok) {
      setFuncionarios(data.funcionarios);
    }
  }

  async function criarFuncionario(e: any) {
    e.preventDefault();
    setMensagem("");

    const resp = await fetch("/api/funcionarios", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        email,
        senha,
        role: "funcionario"
      })
    });

    const data = await resp.json();

    if (!resp.ok) {
      alert(data.error || "Erro ao criar funcionário");
      return;
    }

    setMensagem("Funcionário criado com sucesso!");
    setNome("");
    setEmail("");
    setSenha("");
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Funcionários</h1>

      {/* Criar */}
      <form onSubmit={criarFuncionario} className="space-y-4 mb-8 border p-4 rounded shadow bg-white">
        <h2 className="font-semibold mb-2">Criar Funcionário</h2>

        <input
          type="text"
          placeholder="Nome"
          className="w-full border p-2 rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button className="bg-black text-white w-full py-2 rounded hover:opacity-90">
          Criar Funcionário
        </button>

        {mensagem && (
          <p className="text-green-600 font-semibold mt-3 text-center">
            {mensagem}
          </p>
        )}
      </form>

      {/* Lista */}
      <div className="border p-4 rounded shadow bg-white">
        <h2 className="font-semibold mb-4">Lista de Funcionários</h2>

        {funcionarios.length === 0 && <p>Nenhum funcionário cadastrado.</p>}

        {funcionarios.map((f: any) => (
          <div key={f.id} className="border-b py-2">
            <p><strong>{f.nome}</strong></p>
            <p className="text-sm text-gray-600">{f.email}</p>
            <p className="text-xs text-gray-500">Role: {f.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
