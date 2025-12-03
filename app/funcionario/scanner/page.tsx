'use client';

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";

export default function ScannerPage() {
  const [pacote, setPacote] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [erro, setErro] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear();
      }
    };
  }, []);

  const iniciarScanner = async () => {
    try {
      setErro("");
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      const devices = await Html5Qrcode.getCameras();
      let cameraId = devices[0]?.id;

      // Procurar câmera traseira
      for (const device of devices) {
        if (device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('traseira')) {
          cameraId = device.id;
          break;
        }
      }

      if (!cameraId) {
        setErro("Nenhuma câmera encontrada");
        return;
      }

      await html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        () => {}
      );

      setScanning(true);
    } catch (err: any) {
      setErro(err.message || "Erro ao iniciar scanner");
    }
  };

  const pararScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error('Erro ao parar scanner:', err);
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  function onScanSuccess(decodedText: string) {
    setStatus("Lendo QR...");
    setErro("");

    let id = decodedText;
    
    if (decodedText.includes('/checkin?id=')) {
      try {
        const url = new URL(decodedText);
        id = url.searchParams.get("id") || decodedText;
      } catch {
        const match = decodedText.match(/id=([^&]+)/);
        id = match ? match[1] : decodedText;
      }
    } else if (decodedText.includes('id=')) {
      const match = decodedText.match(/id=([^&]+)/);
      id = match ? match[1] : decodedText;
    }

    if (!id) {
      setErro("QR inválido.");
      return;
    }

    buscarPacote(id);
    pararScanner();
  }

  async function buscarPacote(id: string) {
    setStatus("Carregando pacote...");

    const resp = await fetch(`/api/pacotes/${id}`);

    const data = await resp.json();

    if (!resp.ok) {
      setErro(data.error || "Pacote não encontrado");
      setPacote(null);
      return;
    }

    setPacote(data.pacote);
    setStatus("Pacote encontrado");
  }

  async function entregarMesa(tipo: "1mesa" | "todas") {
    if (!pacote) return;

    setStatus("Registrando entrega...");
    setErro("");

    const resp = await fetch("/api/checkin", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_pacote: pacote.id,
        acao: tipo
      })
    });

    const data = await resp.json();

    if (!resp.ok) {
      setErro(data.error || "Erro no check-in");
      return;
    }

    setPacote({
      ...pacote,
      qtd_mesas_usadas: data.usadas,
    });

    setStatus("Entrega registrada com sucesso!");
  }

  const mesasRestantes = pacote 
    ? pacote.qtd_mesas_compradas - pacote.qtd_mesas_usadas 
    : 0;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Scanner de Mesas</h1>

      {!scanning && !pacote && (
        <button
          onClick={iniciarScanner}
          className="w-full bg-black text-white py-2 rounded mb-4 hover:opacity-90"
        >
          Iniciar Scanner
        </button>
      )}

      <div id="qr-reader" className="mb-6" />

      {scanning && (
        <button
          onClick={pararScanner}
          className="w-full bg-red-600 text-white py-2 rounded mb-4 hover:opacity-90"
        >
          Parar Scanner
        </button>
      )}

      {status && (
        <p className="text-green-600 font-semibold mb-2">{status}</p>
      )}

      {erro && (
        <p className="text-red-600 font-semibold mb-2">{erro}</p>
      )}

      {pacote && (
        <div className="border rounded-lg p-4 shadow mb-4 bg-white">
          <h2 className="font-bold text-lg mb-2">Cliente:</h2>
          <p className="mb-1"><strong>Nome:</strong> {pacote.nome_cliente}</p>
          <p className="mb-1"><strong>Telefone:</strong> {pacote.telefone || 'N/A'}</p>

          <hr className="my-3" />

          <p><strong>Mesas compradas:</strong> {pacote.qtd_mesas_compradas}</p>
          <p><strong>Mesas entregues:</strong> {pacote.qtd_mesas_usadas}</p>
          <p className={mesasRestantes > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
            <strong>Restantes:</strong> {mesasRestantes}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => entregarMesa("1mesa")}
              disabled={mesasRestantes <= 0}
              className="bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Entregar 1 Mesa
            </button>

            <button
              onClick={() => entregarMesa("todas")}
              disabled={mesasRestantes <= 0}
              className="bg-green-700 text-white py-2 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Entregar Todas
            </button>
          </div>

          <button
            onClick={() => {
              setPacote(null);
              setStatus("");
              setErro("");
            }}
            className="mt-2 w-full bg-gray-500 text-white py-2 rounded hover:opacity-90"
          >
            Escanear Outro
          </button>
        </div>
      )}
    </div>
  );
}
