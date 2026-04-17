const request = require('supertest');
const app = require('../server');

describe('Pet Stadium System API', () => {
  it('GET /api/stadium - Should return stadium info', async () => {
    const res = await request(app).get('/api/stadium');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('zones');
    expect(res.body).toHaveProperty('alerts');
  });

  it('POST /api/pets/register - Should fail on missing required fields', async () => {
    const res = await request(app).post('/api/pets/register').send({
      ownerName: 'John Doe'
      // Missing petName, breed, age
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('POST /api/pets/register - Should register a pet successfully', async () => {
    const res = await request(app).post('/api/pets/register').send({
      ownerName: 'John Doe',
      petName: 'Rex',
      breed: 'Golden Retriever',
      age: 3,
      dietType: 'Standard'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Pet registered successfully!');
    expect(res.body.pet).toHaveProperty('id');
    expect(res.body.pet).toHaveProperty('digitalPassQR');
  });

  it('POST /api/chatbot - Should return a chatbot reply', async () => {
    const res = await request(app).post('/api/chatbot').send({
      message: 'Where is the nearest pet zone?'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reply');
    expect(res.body.reply).toContain('Pet Relief Zone A');
  });

  it('Should include security headers (Helmet)', async () => {
    const res = await request(app).get('/api/stadium');
    expect(res.headers['x-dns-prefetch-control']).toEqual('off');
    expect(res.headers['x-frame-options']).toEqual('SAMEORIGIN');
  });
});
