// Polyfill import.meta.env for Vite compatibility in Jest
// The AST transformer converts import.meta.env.X to process.env.X
// so we need to set the VITE_ vars on process.env

process.env.VITE_API_BASE_URL = 'http://localhost:8080';
process.env.MODE = 'test';
process.env.DEV = 'true';
process.env.PROD = 'false';
process.env.SSR = 'false';
process.env.BASE_URL = '/';
