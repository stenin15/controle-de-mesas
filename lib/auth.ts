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

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: UserPayload) {
  const SECRET = process.env.JWT_SECRET as string;

  if (!SECRET) {
    throw new Error('JWT_SECRET não está definido no ambiente.');
  }

  // IMPORTANTE: incluir a role no token também
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
    },
    SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): UserPayload {
  const SECRET = process.env.JWT_SECRET;

  if (!SECRET) {
    throw new Error('JWT_SECRET não está definido no ambiente da Vercel.');
  }

  const decoded = jwt.verify(token, SECRET) as any;

  return {
    id: decoded.id as string,
    email: decoded.email as string,
    role: decoded.role as UserRole,
    nome: decoded.nome as string,
  };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<UserPayload | null> {
  // Usar 'role' conforme schema.sql
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, email, senha_hash, role, nome')
    .eq('email', email)
    .single();

  if (error || !data) {
    console.error(
      '❌ [authenticateUser] Erro ao buscar usuário:',
      error?.message || 'Usuário não encontrado'
    );
    return null;
  }

  const isValid = await verifyPassword(password, data.senha_hash);
  if (!isValid) {
    console.error('❌ [authenticateUser] Senha inválida para:', email);
    return null;
  }

  const role = (data.role || 'funcionario') as UserRole;

  return {
    id: data.id,
    email: data.email,
    role,
    nome: data.nome,
  };
}



