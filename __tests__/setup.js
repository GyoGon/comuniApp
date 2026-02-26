import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * Database connection setup for tests
 * In actual implementation, this would connect to a test database
 */
export const setupTestDatabase = async () => {
  // Setup test database connection here
  // For now, mocked operations will be used
  console.log('Test database setup initialized');
};

/**
 * Cleanup test database after tests
 */
export const cleanupTestDatabase = async () => {
  // Cleanup test database here
  console.log('Test database cleanup completed');
};

/**
 * Mock data factory for creating test users
 */
export const createMockUser = (overrides = {}) => {
  return {
    id: 1,
    nombre: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    telefono: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Mock data factory for creating test posts
 */
export const createMockPost = (overrides = {}) => {
  return {
    id: 1,
    titulo: 'Test Post Title',
    descripcion: 'This is a test post description with sufficient length',
    categoria_id: 1,
    ubicacion_id: 1,
    usuario_id: 1,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Mock data factory for creating test categories
 */
export const createMockCategory = (overrides = {}) => {
  return {
    id: 1,
    nombre: 'Test Category',
    descripcion: 'Test category description',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Mock data factory for creating test locations
 */
export const createMockLocation = (overrides = {}) => {
  return {
    id: 1,
    nombre: 'Test Location',
    latitud: 40.7128,
    longitud: -74.006,
    direccion: '123 Test Street',
    ciudad: 'Test City',
    provincia: 'Test Province',
    pais: 'Test Country',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Generate a test JWT access token
 * @param {number} userId - User ID to include in token
 * @returns {string} JWT token
 */
export const generateTestAccessToken = (userId = 1) => {
  const token = jwt.sign(
    { userId, email: 'test@example.com' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
  return token;
};

/**
 * Generate a test JWT refresh token
 * @param {number} userId - User ID to include in token
 * @returns {string} JWT token
 */
export const generateTestRefreshToken = (userId = 1) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'test-refresh-secret',
    { expiresIn: '7d' }
  );
  return token;
};

/**
 * Hash password for test user creation
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashTestPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

/**
 * Compare password with hash (useful for testing password verification)
 * @param {string} password - Plain text password
 * @param {string} hash - Password hash
 * @returns {Promise<boolean>} True if password matches hash
 */
export const compareTestPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Reset all mocks
 */
export const resetMocks = () => {
  jest.clearAllMocks();
  jest.resetModules();
};

/**
 * Global test setup
 */
export const setupTests = async () => {
  await setupTestDatabase();
};

/**
 * Global test teardown
 */
export const teardownTests = async () => {
  await cleanupTestDatabase();
};
