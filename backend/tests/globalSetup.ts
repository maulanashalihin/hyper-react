import { rmSync, existsSync } from 'fs';
import { join } from 'path';

const TEST_DB_PATH = join(process.cwd(), 'backend', 'test.sqlite');

export async function setup() {
  if (existsSync(TEST_DB_PATH)) {
    rmSync(TEST_DB_PATH);
  }
  console.log('Global setup: Test database cleaned');
}

export async function teardown() {
  if (existsSync(TEST_DB_PATH)) {
    rmSync(TEST_DB_PATH);
  }
  console.log('Global teardown: Test database removed');
}
