import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let user_registered;
  let user_loggedin;
  let user_protected_route;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    await app.init();
  });

  describe('User registration', () => {
    it('with valid inputs', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'testpass',
        })
        .expect(201);
      user_registered = response.body;
    });

    it('with invalid inputs', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'testuser',
          password: 'testpass',
        })
        .expect(400);
    });
  });

  describe('User login', () => {
    it('User login with valid credentials', async () => {
      await request(app.getHttpServer()).post('/api/auth/register').send({
        username: 'testuserlogin',
        password: 'testpass',
      });
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'testuserlogin',
          password: 'testpass',
        })
        .expect(200);
      user_loggedin = response.body;
      expect(response.body).toHaveProperty('access_token');
    });

    it('User login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpass',
        })
        .expect(401);
    });
  });

  describe('protected route', () => {
    it('Accessing protected routes with valid JWT token', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'testUserProtectedRoute',
          password: 'testpass',
        })
        .expect(201);
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'testUserProtectedRoute',
          password: 'testpass',
        })
        .expect(200);
      user_protected_route = response.body;

      return request(app.getHttpServer())
        .get('/api/protected/')
        .set('Authorization', `Bearer ${user_protected_route.access_token}`)
        .expect(200);
    });

    it('Accessing protected routes with invalid JWT token', () => {
      return request(app.getHttpServer())
        .get('/api/protected')
        .set('Authorization', 'Bearer invalidtokenhere')
        .expect(401);
    });
  });

  afterAll(async () => {
    await deleteAllAccounts();
  });

  async function deleteAllAccounts() {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'testpass',
      })
      .expect(200);
    user_registered = response.body;
    await request(app.getHttpServer())
      .delete('/api/protected/user')
      .set('Authorization', `Bearer ${user_loggedin.access_token}`);
    await request(app.getHttpServer())
      .delete('/api/protected/user')
      .set('Authorization', `Bearer ${user_registered.access_token}`);
    await request(app.getHttpServer())
      .delete('/api/protected/user')
      .set('Authorization', `Bearer ${user_protected_route.access_token}`);

    await app.close();
  }
});
