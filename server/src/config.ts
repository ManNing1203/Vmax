require('dotenv').config()

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} in .env (see .env.example)`);
  }
  return value;
}

export const JWT_SECRET = required('JWT_SECRET');
export const SESSION_SECRET = process.env.SESSION_SECRET || JWT_SECRET;
export const PORT = Number(process.env.PORT) || 3000;
