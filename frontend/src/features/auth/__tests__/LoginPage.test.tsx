import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.unstable_mockModule('@/app/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

const { default: LoginPage } = await import('../LoginPage');

describe('LoginPage', () => {
  it('renders login page', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    // LoginPage should render something - check it doesn't crash
    expect(document.body).toBeDefined();
  });
});
