'use client';

import { useEffect, useState } from "react";

export default function MeusPacotes() {
  const [pacotes, setPacotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    const resp = await fetch("/api/pacotes");
    const data = await resp.json();

    if (resp.ok) {
      setPacotes(data.pacotes || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) {
    return <p className="p-6">Carregando pacotes...</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Meus Pacotes</h1>

      {pacotes.length === 0 && (
        <p className="text-gray-600">Nenhum pacote criado.</p>
      )}

      <div className="space-y-4">
        {pacotes.map((p) => {
          const usadas = p.qtd_mesas_usadas;
          const compradas = p.qtd_mesas_compradas;
          const restantes = compradas - usadas;

          return (
            <div key={p.id} className="border p-4 rounded shadow bg-white">
              <p><strong>Cliente:</strong> {p.nome_cliente}</p>
              <p><strong>Telefone:</strong> {p.telefone}</p>

              <p className="mt-2">
                <strong>Mesas:</strong> {usadas}/{compradas}  
                <span className="text-gray-500 text-sm ml-2">
                  (Restantes: {restantes})
                </span>
              </p>

              <p><strong>Valor:</strong> R$ {Number(p.preco_total).toFixed(2)}</p>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(p.data_compra).toLocaleString("pt-BR")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
