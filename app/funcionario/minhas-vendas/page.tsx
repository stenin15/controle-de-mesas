'use client';

import { useEffect, useState } from "react";

export default function MinhasVendas() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    const resp = await fetch("/api/vendas");
    const data = await resp.json();

    if (resp.ok) {
      // Filtra vendas do funcionário logado
      setVendas(data.vendas || []);
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
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Minhas Vendas</h1>

      {vendas.length === 0 && (
        <p className="text-gray-600">Nenhuma venda registrada.</p>
      )}

      <div className="space-y-4">
        {vendas.map((venda) => (
          <div key={venda.id} className="border p-4 rounded shadow bg-white">

            <div className="flex justify-between items-center">
              <p className="font-semibold">
                {venda.pacotes?.nome_cliente || "Cliente não informado"}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded 
                ${venda.tipo === 'presencial'
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-green-200 text-green-800'}
                `}
              >
                {venda.tipo}
              </span>
            </div>

            <p className="mt-2">
              <strong>Valor:</strong> R$ {Number(venda.valor).toFixed(2)}
            </p>
            <p><strong>Mesas:</strong> {venda.mesas}</p>

            <p className="text-xs text-gray-500 mt-2">
              {new Date(venda.data).toLocaleString("pt-BR")}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
}
