import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

let adminToken = '';

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'annarsjay3@gmail.com', password: 'password123' });
  adminToken = res.body.token;
});

describe('API Tests', () => {
  it('should authenticate Root Super Admin', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'annarsjay3@gmail.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.role).toBe('root_super_admin');
  });

  it('should list products publicly', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should create an order (public)', async () => {
    const payload = {
      customerName: 'John Doe',
      customerPhone: '09012345678',
      items: [{
        productId: 'p1',
        productName: 'Classic Black Tee',
        quantity: 1,
        price: 15000
      }],
      subtotal: 15000,
      discount: 0,
      total: 15000,
      status: 'WhatsApp Pending',
      deliveryMethod: 'pickup'
    };

    const res = await request(app).post('/orders').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.reference).toBeDefined();
    expect(res.body.deliveryFee).toBe(0); // Store pickup must be 0
  });

  it('should create local delivery order without assuming fee', async () => {
    const payload = {
      customerName: 'Jane Doe',
      customerPhone: '09012345678',
      deliveryAddress: 'Lagos',
      items: [{
        productId: 'p1',
        productName: 'Classic Black Tee',
        quantity: 1,
        price: 15000
      }],
      subtotal: 15000,
      discount: 0,
      total: 15000,
      status: 'WhatsApp Pending',
      deliveryMethod: 'local',
      deliveryFee: null
    };

    const res = await request(app).post('/orders').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.deliveryFee).toBeNull(); 
  });

  it('should reject invalid ratings', async () => {
    const payload = {
      rating: 6, // Invalid, max 5
      customerId: '123',
      customerName: 'Test'
    };
    const res = await request(app).post('/ratings/p1').send(payload);
    expect(res.status).toBe(400);
  });

  it('should accept valid rating', async () => {
    const payload = {
      rating: 5,
      customerId: '123',
      customerName: 'Test'
    };
    const res = await request(app).post('/ratings/p1').send(payload);
    expect(res.status).toBe(201);
  });

  it('should protect root super admin from deletion', async () => {
    // get users
    const usersRes = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    const rootAdmin = usersRes.body.find((u: any) => u.email === 'annarsjay3@gmail.com');
    
    // try to delete
    const delRes = await request(app)
      .delete(`/users/${rootAdmin.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(delRes.status).toBe(403);
    expect(delRes.body.error).toContain('Forbidden: Root Super Admin cannot be deleted');
  });
});
