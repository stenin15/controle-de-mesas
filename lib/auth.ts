import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from './supabaseAdmin';

export type UserRole = 'admin' | 'funcionario';

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
  nome: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: UserPayload): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      nome: user.nome,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): UserPayload {
  const decoded = jwt.verify(token, JWT_SECRET!) as any;

  return {
    id: decoded.sub as string,
    email: decoded.email as string,
    role: decoded.role as UserRole,
    nome: decoded.nome as string,
  };
}

export async function authenticateUser(email: string, password: string): Promise<UserPayload | null> {
  // Debug: verificar URL do Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 [authenticateUser] Conectando ao Supabase:', supabaseUrl);
    if (supabaseUrl && supabaseUrl.includes('localhost')) {
      console.error('⚠️ ERRO: Tentando conectar ao localhost em vez do Supabase!');
    }
  }

  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, email, senha_hash, role, nome')
    .eq('email', email)
    .single();

  if (error) {
    console.error('❌ [authenticateUser] Erro ao buscar usuário:', error.message);
    console.error('   Código:', error.code);
    return null;
  }

  if (!data) {
    console.log('⚠️ [authenticateUser] Usuário não encontrado');
    return null;
  }

  const isValid = await verifyPassword(password, data.senha_hash);
  if (!isValid) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    role: data.role as 'admin' | 'funcionario',
    nome: data.nome,
  };
}



