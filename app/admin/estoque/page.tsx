'use client';

import { useEffect, useState } from "react";

export default function AdminEstoque() {
  const [totalMesas, setTotalMesas] = useState<number | null>(null);
  const [mesasEntregues, setMesasEntregues] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");

  async function carregarEstoque() {
    setLoading(true);
    const resp = await fetch("/api/estoque");
    const data = await resp.json();

    if (resp.ok) {
      setTotalMesas(data.estoque.total_mesas);
      setMesasEntregues(data.estoque.mesas_entregues);
    }

    setLoading(false);
  }

  async function atualizarEstoque(e: any) {
    e.preventDefault();
    setMensagem("");

    const resp = await fetch("/api/estoque", {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total_mesas: totalMesas })
    });

    const data = await resp.json();

    if (!resp.ok) {
      alert(data.error || "Erro ao atualizar estoque");
      return;
    }

    setMensagem("Estoque atualizado com sucesso!");
    carregarEstoque();
  }

  useEffect(() => {
    carregarEstoque();
  }, []);

  if (loading) {
    return <p className="p-6">Carregando estoque...</p>;
  }

  const mesasRestantes = Number(totalMesas) - mesasEntregues;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Controle de Estoque</h1>

      <div className="border p-4 rounded-lg shadow-sm bg-white mb-6">
        <p className="mb-2"><strong>Total de mesas:</strong> {totalMesas}</p>
        <p className="mb-2"><strong>Mesas entregues:</strong> {mesasEntregues}</p>
        <p><strong>Restantes:</strong> {mesasRestantes}</p>
      </div>

      <form onSubmit={atualizarEstoque} className="space-y-4">
        <div>
          <label className="font-semibold">Alterar total de mesas</label>
          <input
            type="number"
            className="w-full border p-2 rounded mt-1"
            value={totalMesas ?? ""}
            onChange={(e) => setTotalMesas(Number(e.target.value))}
            required
            min="0"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          Atualizar Estoque
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
