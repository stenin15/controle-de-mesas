'use client';

import { useEffect, useState } from "react";

export default function AdminVendas() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    const resp = await fetch("/api/vendas");
    const data = await resp.json();

    if (resp.ok) {
      setVendas(data.vendas);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) {
    return <p className="p-6">Carregando vendas...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Vendas</h1>

      <div className="border rounded-lg shadow bg-white">
        {vendas.length === 0 && (
          <p className="p-4 text-gray-600">Nenhuma venda registrada.</p>
        )}

        {vendas.map((venda) => (
          <div key={venda.id} className="border-b p-4">
            <div className="flex justify-between">
              <p>
                <strong>Cliente:</strong> {venda.pacotes?.nome_cliente || "—"}
              </p>
              <span
                className={`text-sm px-2 py-1 rounded 
                ${venda.tipo === "estorno" ? "bg-red-200 text-red-800" :
                  venda.tipo === "presencial" ? "bg-blue-200 text-blue-800" :
                  "bg-green-200 text-green-800"}`}
              >
                {venda.tipo}
              </span>
            </div>

            <p className="mt-1"><strong>Valor:</strong> R$ {Number(venda.valor).toFixed(2)}</p>
            <p><strong>Mesas:</strong> {venda.mesas}</p>

            <p className="text-sm text-gray-700 mt-1">
              <strong>Vendedor:</strong> {venda.usuarios?.nome || "—"}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {new Date(venda.data).toLocaleString("pt-BR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
