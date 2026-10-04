import { services as mockServices } from './mock';
import { apiServices } from './api';

const forceMock = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === 'true';
const isTestMode = process.env.NODE_ENV === 'test';

// Default to API in dev/prod unless forced to mock, but keep mock for tests to remain deterministic
export const services = (forceMock || isTestMode) ? mockServices : apiServices;
