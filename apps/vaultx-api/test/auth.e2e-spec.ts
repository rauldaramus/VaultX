/**
 * @file: auth.e2e-spec.ts
 * @version: 0.0.0
 * @author: Raul Daramus
 * @date: 2025
 * Copyright (C) 2025 VaultX by Raul Daramus
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * You are free to:
 *   - Share — copy and redistribute the material in any medium or format
 *   - Adapt — remix, transform, and build upon the material
 *
 * Under the following terms:
 *   - Attribution — You must give appropriate credit, provide a link to the license,
 *     and indicate if changes were made.
 *   - NonCommercial — You may not use the material for commercial purposes.
 *   - ShareAlike — If you remix, transform, or build upon the material, you must
 *     distribute your contributions under the same license as the original.
 */

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

type SessionResponse = {
  id: string;
  isCurrentSession?: boolean;
};

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let testEmail: string;
  let sessionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same pipes as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      })
    );

    app.setGlobalPrefix('api/v1');

    await app.init();

    // Generate unique email for this test run
    testEmail = `test-${Date.now()}@example.com`;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: testEmail,
          password: 'Test123!@#Strong',
          displayName: 'E2E Test User',
        })
        .expect(201)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toBeDefined();
          expect(res.body.message).toBe('User registered successfully');
        });
    });

    it('should fail with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: testEmail,
          password: 'Test123!@#Strong',
          displayName: 'Duplicate User',
        })
        .expect(409);
    });

    it('should fail with weak password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: `weak-${Date.now()}@example.com`,
          password: 'weak',
          displayName: 'Weak Password User',
        })
        .expect(400);
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test123!@#Strong',
          displayName: 'Invalid Email User',
        })
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testEmail,
          password: 'Test123!@#Strong',
          rememberMe: false,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.accessToken).toBeDefined();
          expect(res.body.data.refreshToken).toBeDefined();
          expect(res.body.data.user).toBeDefined();
          expect(res.body.data.user.email).toBe(testEmail);

          // Store tokens for later tests
          accessToken = res.body.data.accessToken;
          refreshToken = res.body.data.refreshToken;
        });
    });

    it('should fail with invalid password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123!',
          rememberMe: false,
        })
        .expect(401);
    });

    it('should fail with non-existent user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!@#Strong',
          rememberMe: false,
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should get current user profile', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user).toBeDefined();
          expect(res.body.data.user.email).toBe(testEmail);
          expect(res.body.data.user.displayName).toBe('E2E Test User');
        });
    });

    it('should fail without authorization', () => {
      return request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
    });

    it('should fail with invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('PATCH /api/v1/auth/profile', () => {
    it('should update user profile', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          displayName: 'Updated E2E Test User',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user.displayName).toBe('Updated E2E Test User');
          expect(res.body.message).toBe('Profile updated');
        });
    });

    it('should fail without authorization', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/auth/profile')
        .send({
          displayName: 'Should Fail',
        })
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh access token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.accessToken).toBeDefined();
          expect(res.body.data.refreshToken).toBeDefined();
          expect(res.body.message).toBe('Token rotated');

          // Update tokens
          accessToken = res.body.data.accessToken;
          refreshToken = res.body.data.refreshToken;
        });
    });

    it('should fail with invalid refresh token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: 'invalid-refresh-token',
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/auth/sessions', () => {
    it('should list active sessions', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/sessions')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.sessions).toBeDefined();
          expect(Array.isArray(res.body.data.sessions)).toBe(true);
          expect(res.body.data.sessions.length).toBeGreaterThan(0);

          // Store a session ID for later test
          if (res.body.data.sessions.length > 0) {
            const nonCurrentSession = (
              res.body.data.sessions as SessionResponse[]
            ).find(session => !session.isCurrentSession);
            if (nonCurrentSession) {
              sessionId = nonCurrentSession.id;
            }
          }
        });
    });

    it('should fail without authorization', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/sessions')
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/change-password', () => {
    it('should change user password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'Test123!@#Strong',
          newPassword: 'NewPassword123!@#Strong',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
        });
    });

    it('should fail with wrong current password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'WrongPassword123!',
          newPassword: 'AnotherPassword123!@#',
        })
        .expect(401);
    });

    it('should login with new password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testEmail,
          password: 'NewPassword123!@#Strong',
          rememberMe: false,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          accessToken = res.body.data.accessToken;
        });
    });
  });

  describe('POST /api/v1/auth/reset-password/request', () => {
    it('should request password reset', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/reset-password/request')
        .send({
          email: testEmail,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
        });
    });

    it('should not fail with non-existent email (security)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/reset-password/request')
        .send({
          email: 'nonexistent@example.com',
        })
        .expect(200);
    });
  });

  describe('DELETE /api/v1/auth/sessions/:sessionId', () => {
    it('should revoke a session if exists', async () => {
      if (sessionId) {
        return request(app.getHttpServer())
          .delete(`/api/v1/auth/sessions/${sessionId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
          });
      } else {
        // Skip if no other session exists
        return Promise.resolve();
      }
    });

    it('should fail without authorization', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/auth/sessions/some-session-id')
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.message).toBe('Logged out successfully');
        });
    });

    it('should fail to access protected route after logout', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401);
    });

    it('should fail without authorization', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .expect(401);
    });
  });

  describe('GET /api/v1/auth/oauth/:provider/authorize', () => {
    it('should initiate OAuth flow for google', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/oauth/google/authorize')
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.authorizationUrl).toBeDefined();
          expect(res.body.data.state).toBeDefined();
        });
    });

    it('should initiate OAuth flow for github', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/oauth/github/authorize')
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.authorizationUrl).toBeDefined();
          expect(res.body.data.state).toBeDefined();
        });
    });
  });

  describe('GET /api/v1/auth/oauth/:provider/callback', () => {
    it('should fail without code parameter', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/oauth/google/callback')
        .query({ state: 'some-state' })
        .expect(400);
    });

    it('should fail without state parameter', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/oauth/google/callback')
        .query({ code: 'some-code' })
        .expect(400);
    });
  });
});
