import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL
    },
  },
});

// Test the connection
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch((e) => {
    console.error('Failed to connect to database:', e);
  });

export default prisma;
