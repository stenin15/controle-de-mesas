'use client';

import { useState } from "react";

export default function VendaPresencial() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [qtd, setQtd] = useState(1);
  const [preco, setPreco] = useState(100);
  const [mensagem, setMensagem] = useState("");

  const combos = [
    { mesas: 1, preco: 100 },
    { mesas: 2, preco: 180 },
    { mesas: 3, preco: 250 },
  ];

  async function enviarVenda(e: any) {
    e.preventDefault();
    setMensagem("");

    const resp = await fetch("/api/venda-presencial", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome_cliente: nome,
        telefone,
        qtd_mesas_compradas: qtd,
        preco_total: preco
      })
    });

    const data = await resp.json();

    if (!resp.ok) {
      alert(data.error || "Erro na venda presencial");
      return;
    }

    setMensagem("Venda registrada com sucesso!");
    setNome("");
    setTelefone("");
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Venda Presencial</h1>

      <form onSubmit={enviarVenda} className="space-y-4">
        <input
          type="text"
          placeholder="Nome do cliente"
          className="w-full border p-2 rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Telefone (opcional)"
          className="w-full border p-2 rounded"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <div>
          <label className="font-semibold">Escolher combo</label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {combos.map((c, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  setQtd(c.mesas);
                  setPreco(c.preco);
                }}
                className={`border rounded p-2 text-center 
                ${qtd === c.mesas ? "bg-black text-white" : ""}`}
              >
                {c.mesas}x Mesa<br />R$ {c.preco}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold">Preço personalizado:</label>
          <input
            type="number"
            className="w-full border p-2 rounded mt-2"
            value={preco}
            onChange={(e) => setPreco(Number(e.target.value))}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          Registrar Venda
        </button>
      </form>

      {mensagem && (
        <p className="mt-4 text-green-600 font-semibold text-center">
          {mensagem}
        </p>
      )}
    </div>
  );
}
