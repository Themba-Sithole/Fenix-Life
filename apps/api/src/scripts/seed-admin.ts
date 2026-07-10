import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('ADMIN_SEED_PASSWORD must be at least 8 characters');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      displayName: 'Fenix Admin',
      role: 'ADMIN',
    },
    update: {
      passwordHash,
      role: 'ADMIN',
      suspended: false,
    },
    select: { id: true, email: true, role: true },
  });

  console.log(`Admin user ready: ${user.email} (${user.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
