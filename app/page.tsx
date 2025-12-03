'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para login imediatamente
    router.replace('/login');
  }, [router]);

  // Mostra loading enquanto redireciona
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}



