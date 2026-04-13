import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi, beforeEach } from 'vitest';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
});
