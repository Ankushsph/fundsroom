import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password helper
  const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };

  // Create test users
  const users = [
    {
      email: 'admin@fundsroom.com',
      password: await hashPassword('Admin@123'),
      name: 'Admin User',
      role: 'ADMIN' as const,
    },
    {
      email: 'sales@fundsroom.com',
      password: await hashPassword('Sales@123'),
      name: 'Sales User',
      role: 'SALES' as const,
    },
    {
      email: 'warehouse@fundsroom.com',
      password: await hashPassword('Warehouse@123'),
      name: 'Warehouse User',
      role: 'WAREHOUSE' as const,
    },
    {
      email: 'accounts@fundsroom.com',
      password: await hashPassword('Accounts@123'),
      name: 'Accounts User',
      role: 'ACCOUNTS' as const,
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`✓ Created user: ${user.email} (${user.role})`);
  }

  console.log('✅ Seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('-------------------');
  console.log('ADMIN:     admin@fundsroom.com / Admin@123');
  console.log('SALES:     sales@fundsroom.com / Sales@123');
  console.log('WAREHOUSE: warehouse@fundsroom.com / Warehouse@123');
  console.log('ACCOUNTS:  accounts@fundsroom.com / Accounts@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
