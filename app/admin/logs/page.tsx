'use client';

import { useEffect, useState } from "react";

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    const resp = await fetch("/api/logs");
    const data = await resp.json();

    if (resp.ok) {
      setLogs(data.logs);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) {
    return <p className="p-6">Carregando logs...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Logs do Sistema</h1>

      <div className="border rounded-lg shadow bg-white">
        {logs.length === 0 && (
          <p className="p-4 text-gray-600">Nenhuma ação registrada.</p>
        )}

        {logs.map((log) => (
          <div key={log.id} className="border-b p-4">
            
            {/* Título da ação */}
            <div className="flex justify-between">
              <span
                className={`text-sm px-2 py-1 rounded capitalize
                ${
                  log.acao === "estorno"
                    ? "bg-red-200 text-red-800"
                    : log.acao.includes("venda")
                    ? "bg-green-200 text-green-800"
                    : log.acao === "checkin"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {log.acao.replace("_", " ")}
              </span>

              <p className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString("pt-BR")}
              </p>
            </div>

            {/* Nome do usuário */}
            <p className="mt-2">
              <strong>Usuário:</strong> {log.usuarios?.nome || "—"}
            </p>

            {/* Pacote relacionado */}
            {log.pacote_id && (
              <p className="text-sm text-gray-600">
                <strong>Pacote ID:</strong> {log.pacote_id}
              </p>
            )}

            {/* Detalhes */}
            {log.detalhes && (
              <pre className="bg-gray-100 p-2 rounded text-xs mt-2 overflow-x-auto">
                {JSON.stringify(log.detalhes, null, 2)}
              </pre>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
