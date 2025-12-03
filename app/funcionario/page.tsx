'use client';

import Link from "next/link";

export default function FuncionarioHome() {
  const cards = [
    {
      title: "Vender (WhatsApp)",
      desc: "Gerar pacote + QR para enviar ao cliente",
      href: "/funcionario/vender",
      color: "bg-green-100 text-green-800"
    },
    {
      title: "Venda Presencial",
      desc: "Registrar venda realizada no local",
      href: "/funcionario/venda-presencial",
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Scanner QR",
      desc: "Entregar mesas lendo o QR Code",
      href: "/funcionario/scanner",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      title: "Meus Pacotes",
      desc: "Visualize pacotes criados por você",
      href: "/funcionario/pacotes",
      color: "bg-gray-100 text-gray-800"
    },
  ];

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-6">Painel do Funcionário</h1>

      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className={`p-4 rounded-lg shadow border hover:opacity-90 transition cursor-pointer ${card.color}`}
          >
            <h2 className="font-semibold text-lg">{card.title}</h2>
            <p className="text-sm mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}


