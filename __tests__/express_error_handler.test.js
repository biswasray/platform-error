import express from 'express';
import request from 'supertest';
import PlatformError, { CustomError, ExpressErrorHandler } from '..';

describe('ExpressErrorHandler Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    // app.use(expressAsyncErrors()); // Ensure you apply this middleware to handle async errors
  });

  it('should respond with a Bad Request status and serialized error if a PlatformError is thrown', async () => {
    app.use((req, res, next) => {
      const customError = new PlatformError('Bad Request', {
        messages: ['Invalid Email', 'Password must contain alphanumerics'],
      });
      throw customError;
    });
    app.use(ExpressErrorHandler());
    const response = await request(app).get('/');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      errors: [
        { message: 'Bad Request' },
        { message: 'Invalid Email' },
        { message: 'Password must contain alphanumerics' },
      ],
    });
  });

  it('should respond with a Not Found status and serialized error if a PlatformError is thrown', async () => {
    const customError = new PlatformError('Not Found', { messages: 'Username does not exist', resource: 'User' });
    app.use((req, res, next) => {
      throw customError;
    });
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    app.use(ExpressErrorHandler(true));
    const response = await request(app).get('/');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: false,
      errors: [{ message: 'Not Found' }, { message: 'Username does not exist' }, { message: 'User' }],
    });
    expect(mockConsoleLog).toHaveBeenCalledWith(customError);

    // Restore the original implementation of console.log
    mockConsoleLog.mockRestore();
  });

  it('should respond with a Not Found status and serialized error if a PlatformError is thrown', async () => {
    app.use((req, res, next) => {
      const customError = new PlatformError('Unauthorized', {
        messages: 'You are not authorized to access this resource',
      });
      throw customError;
    });
    app.use(ExpressErrorHandler());
    const response = await request(app).get('/');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: false,
      errors: [{ message: 'Unauthorized' }, { message: 'You are not authorized to access this resource' }],
    });
  });

  it('should respond with a custom error status and serialized error if a CustomError is thrown', async () => {
    app.use((req, res, next) => {
      // Simulate throwing a CustomError 'Test custom error', 400
      const customError = new CustomError(400, ['Test custom error']);
      throw customError;
      //   next(customError);
    });

    // Apply the ExpressErrorHandler middleware at the end of your routing
    app.use(ExpressErrorHandler());

    // Act
    const response = await request(app).get('/');

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      errors: [{ message: 'Test custom error' }],
    });
  });

  it('should respond with a custom error status, serialized error and log the error ', async () => {
    app.use((req, res, next) => {
      // Simulate throwing a CustomError 'Test custom error', 400
      const customError = new CustomError(507, ['Test custom error']);
      throw customError;
      //   next(customError);
    });

    // Apply the ExpressErrorHandler middleware at the end of your routing
    app.use(
      ExpressErrorHandler((err) => {
        expect(err).toBeInstanceOf(CustomError);
      }),
    );

    // Act
    const response = await request(app).get('/');

    // Assert
    expect(response.status).toBe(507);
    expect(response.body).toEqual({
      status: false,
      errors: [{ message: 'Test custom error' }],
    });
  });

  it('should respond with a default 500 status and error message for other errors', async () => {
    // Arrange
    app.use((req, res, next) => {
      // Simulate throwing a regular Error
      throw new Error('Test unexpected error');
    });

    // Apply the ExpressErrorHandler middleware at the end of your routing
    app.use(ExpressErrorHandler());

    // Act
    const response = await request(app).get('/');

    // Assert
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: false,
      errors: [{ message: 'Test unexpected error' }],
    });
  });
});
