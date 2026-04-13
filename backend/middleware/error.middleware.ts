import type { Request, Response } from 'hyper-express';

interface HttpError extends Error {
  status?: number;
}

export function errorMiddleware(
  error: HttpError,
  req: Request,
  res: Response
): void {
  console.error('Error:', error);

  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
}
