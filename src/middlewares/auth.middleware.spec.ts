import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    middleware = new AuthMiddleware();
    mockRequest = {};
    mockResponse = {};
    nextFunction = jest.fn();
    (jwt.verify as jest.Mock).mockClear();
  });

  it('should throw an UnauthorizedException if authorization header is missing', () => {
    expect(() =>
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).toThrow(UnauthorizedException);
  });

  it('should throw an UnauthorizedException if token is missing', () => {
    mockRequest.headers = {
      authorization: 'Bearer ',
    };

    expect(() =>
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).toThrow(UnauthorizedException);
  });

  it('should throw an UnauthorizedException if token is invalid', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalidToken',
    };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    expect(() =>
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).toThrow(UnauthorizedException);
  });

  it('should throw an UnauthorizedException if token is invalid', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalidToken',
    };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    expect(() =>
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).toThrow(UnauthorizedException);
  });

  it('should call next() with a decoded user object when the token is valid', () => {
    const userPayload = { id: 1, username: 'testUser' };
    mockRequest.headers = {
      authorization: 'Bearer validToken',
    };
    (jwt.verify as jest.Mock).mockReturnValue(userPayload);

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(jwt.verify).toHaveBeenCalled();
    expect(mockRequest['user']).toEqual(userPayload);
    expect(nextFunction).toHaveBeenCalled();
  });
});
