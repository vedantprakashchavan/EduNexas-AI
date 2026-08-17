import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from './config/env.js';
import { UserRole } from './types/index.js';
import { User } from './modules/auth/auth.model.js';
import logger from './utils/logger.js';

const seedData = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing users
    await User.deleteMany({});
    logger.info('Cleared existing users');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@edunexus.com',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isActive: true
      },
      {
        name: 'Jane Teacher',
        email: 'teacher@edunexus.com',
        password: hashedPassword,
        role: UserRole.TEACHER,
        isActive: true
      },
      {
        name: 'John Parent',
        email: 'parent@edunexus.com',
        password: hashedPassword,
        role: UserRole.PARENT,
        isActive: true
      },
      {
        name: 'Alex Student',
        email: 'student@edunexus.com',
        password: hashedPassword,
        role: UserRole.STUDENT,
        isActive: true
      }
    ];

    const createdUsers = await User.create(users);
    logger.info(`Seeded ${createdUsers.length} users successfully`);

    console.log('Seeded Users:');
    createdUsers.forEach(u => console.log(`- ${u.name} (${u.role}): ${u.email}`));

  } catch (error) {
    logger.error(`Error seeding data: ${(error as Error).message}`);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

seedData();
