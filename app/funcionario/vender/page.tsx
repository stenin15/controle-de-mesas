'use client';

import { useState } from "react";

export default function VenderWhatsApp() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [qtd, setQtd] = useState(1);
  const [preco, setPreco] = useState(100);
  const [qrCode, setQrCode] = useState("");

  const combos = [
    { mesas: 1, preco: 100 },
    { mesas: 2, preco: 180 },
    { mesas: 3, preco: 250 },
  ];

  async function gerarPacote(e: any) {
    e.preventDefault();

    const resp = await fetch("/api/pacotes", {
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
      alert(data.error || "Erro ao criar pacote");
      return;
    }

    setQrCode(data.qrCode);
    setNome("");
    setTelefone("");
    setQtd(1);
    setPreco(100);
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Vender (WhatsApp)</h1>

      <form onSubmit={gerarPacote} className="space-y-4">
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
          placeholder="Telefone (DDD + número)"
          className="w-full border p-2 rounded"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
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
          Gerar QR Code
        </button>
      </form>

      {qrCode && (
        <div className="mt-6 text-center">
          <h2 className="font-bold mb-2">QR Code para enviar ao cliente</h2>
          <img src={qrCode} alt="QR Code" className="mx-auto w-48" />

          <button
            onClick={() => navigator.clipboard.writeText(qrCode)}
            className="mt-3 bg-gray-900 text-white px-4 py-2 rounded"
          >
            Copiar QR Code (link/base64)
          </button>
        </div>
      )}
    </div>
  );
}
