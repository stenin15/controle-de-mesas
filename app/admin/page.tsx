'use client';

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [totalMesas, setTotalMesas] = useState(0);
  const [mesasEntregues, setMesasEntregues] = useState(0);

  const [totalVendas, setTotalVendas] = useState(0);
  const [totalEstornos, setTotalEstornos] = useState(0);
  const [liquido, setLiquido] = useState(0);

  async function carregar() {
    setLoading(true);

    // ESTOQUE
    const estoqueResp = await fetch("/api/estoque");
    const estoqueData = await estoqueResp.json();

    if (estoqueResp.ok) {
      setTotalMesas(estoqueData.estoque.total_mesas);
      setMesasEntregues(estoqueData.estoque.mesas_entregues);
    }

    // VENDAS
    const vendasResp = await fetch("/api/vendas");
    const vendasData = await vendasResp.json();

    if (vendasResp.ok) {
      let total = 0;
      let estornos = 0;

      vendasData.vendas.forEach((v: any) => {
        if (v.tipo === "estorno") {
          // Estornos vêm negativos, então somamos (que resulta em negativo)
          estornos += Number(v.valor);
        } else {
          total += Number(v.valor);
        }
      });

      // Estornos são negativos, então convertemos para positivo para exibição
      const estornosAbsoluto = Math.abs(estornos);
      setTotalVendas(total);
      setTotalEstornos(estornosAbsoluto);
      // Faturamento líquido = vendas + estornos (estornos é negativo, então somar = subtrair)
      setLiquido(total + estornos);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) {
    return <p className="p-6">Carregando dashboard...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Dashboard do Evento</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Total de Mesas */}
        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500 text-sm">Total de Mesas</p>
          <p className="text-2xl font-bold">{totalMesas}</p>
        </div>

        {/* Entregues */}
        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500 text-sm">Mesas Entregues</p>
          <p className="text-2xl font-bold text-blue-700">{mesasEntregues}</p>
        </div>

        {/* Restantes */}
        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500 text-sm">Mesas Restantes</p>
          <p className="text-2xl font-bold text-green-700">
            {totalMesas - mesasEntregues}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        {/* Total vendido */}
        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500 text-sm">Total de Vendas</p>
          <p className="text-2xl font-bold text-green-800">
            R$ {totalVendas.toFixed(2)}
          </p>
        </div>

        {/* Estornos */}
        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500 text-sm">Total de Estornos</p>
          <p className="text-2xl font-bold text-red-700">
            R$ {totalEstornos.toFixed(2)}
          </p>
        </div>

        {/* Líquido */}
        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500 text-sm">Faturamento Líquido</p>
          <p className="text-2xl font-bold">
            R$ {liquido.toFixed(2)}
          </p>
        </div>

      </div>
    </div>
  );
}
