import { redirect } from 'next/navigation';

export default function Home() {
  // Sempre redireciona para login
  // O middleware vai lidar com a autenticação
  redirect('/login');
}



