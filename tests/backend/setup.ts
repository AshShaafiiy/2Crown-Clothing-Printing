import { beforeAll, beforeEach, afterAll } from 'vitest';
import { loginLimiter, passwordLimiter } from '../src/utils/httpSecurity';

beforeAll(async () => {
});

beforeEach(async () => {
  for (const key of ['127.0.0.1','::ffff:127.0.0.1','::1']) { loginLimiter.resetKey(key); passwordLimiter.resetKey(key); }

  try {
    await fetch('http://127.0.0.1:8080/emulator/v1/projects/twocrown-clothing/databases/(default)/documents', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error clearing Firestore emulator:', error);
  }
});

afterAll(async () => {
});

import { vi } from 'vitest';

vi.mock('../src/firebase', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    auth: {
      ...actual.auth,
      verifyIdToken: vi.fn(async (token: string) => {
        if (!token) throw new Error('No token');
        if (token.startsWith('invalid-token')) {
          throw new Error('Decoding Firebase ID token failed');
        }

        const [email, password] = token.split(':');

        // Simulate Firebase Auth by checking Firestore
        const user = await userRepository.findByEmail(email);
        if (!user) throw new Error('User not found');

        const bcrypt = require('bcryptjs');
        console.log('Verifying token:', email, password, user.passwordHash); const match = await bcrypt.compare(password, user.passwordHash); console.log('Match?', match);
        if (!match) throw new Error('Decoding Firebase ID token failed');

        return {
          uid: user.id,
          email
        };
      }),
      setCustomUserClaims: vi.fn(async () => {})
    }
  };
});

import { userRepository } from '../src/repositories/UserRepository';
import bcrypt from 'bcryptjs';

beforeEach(async () => {
  const hash = await bcrypt.hash('password123', 10);

  await userRepository.create({
    id: 'root-admin',
    email: 'annarsjay3@gmail.com',
    name: 'Root Admin',
    role: 'root_super_admin',
    active: true,
    passwordHash: hash,
    createdAt: new Date().toISOString()
  });

  await userRepository.create({
    id: 'super-admin',
    email: 'sa@2crown.com',
    name: 'Super Admin',
    role: 'super_admin',
    active: true,
    passwordHash: hash,
    createdAt: new Date().toISOString()
  });

  await userRepository.create({
    id: 'admin',
    email: 'admin@2crown.com',
    name: 'Admin',
    role: 'admin',
    active: true,
    passwordHash: hash,
    createdAt: new Date().toISOString()
  });

  await userRepository.create({
    id: 'admin-ad',
    email: 'ad@2crown.com',
    name: 'Admin',
    role: 'admin',
    active: true,
    passwordHash: await bcrypt.hash('StrongPassword1!', 10),
    createdAt: new Date().toISOString()
  });
});

import { productRepository, settingsRepository } from '../src/repositories';

beforeEach(async () => {
  await productRepository.create({
    id: 'p1',
    name: 'Classic Black Tee',
    description: 'A classic black t-shirt',
    basePrice: 15000,
    categoryId: 'c1',
    images: ['test.jpg'],
    options: [],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  await db.collection('business_settings').doc('default').set({
    id: 'default',
    storeName: 'Test Store',
    contactEmail: 'test@example.com',
    contactPhone: '1234567890',
    whatsappNumber: '1234567890',
    vatPercentage: 0,
    deliverySettings: {
      pickupEnabled: true,
      pickupAddress: '123 Test St',
      localDeliveryEnabled: true,
      localDeliveryFee: 0,
      nationwideDeliveryEnabled: false,
      nationwideDeliveryBaseFee: 0,
      freeDeliveryThreshold: 0
    },
    currency: 'NGN',
    currencySymbol: '₦',
    address: '123 Test St',
    storePickupEnabled: true,
    localDeliveryEnabled: true,
    internationalDeliveryEnabled: false,
    localDeliveryFee: 1500
  });
});
import { db } from '../src/firebase';
