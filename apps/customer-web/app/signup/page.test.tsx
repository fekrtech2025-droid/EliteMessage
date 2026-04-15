import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CustomerSignupRoute from './page';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup();
  delete (
    window as Window & {
      __eliteCustomerAuthRedirectHook?: (path: string) => void;
    }
  ).__eliteCustomerAuthRedirectHook;
  vi.unstubAllGlobals();
  window.sessionStorage.clear();
});

describe('customer signup route', () => {
  it('renders dedicated signup route with account creation controls', () => {
    render(<CustomerSignupRoute />);

    expect(screen.getByText('Create your account')).toBeTruthy();
    expect(screen.getByText('Continue with Google')).toBeTruthy();
    expect(screen.getByText('Already have access?')).toBeTruthy();
    expect(screen.getByAltText('Elite Message brand logo.')).toBeTruthy();
  }, 10000);

  it('signs up and redirects to /dashboard', async () => {
    const redirectSpy = vi.fn();
    (
      window as Window & {
        __eliteCustomerAuthRedirectHook?: (path: string) => void;
      }
    ).__eliteCustomerAuthRedirectHook = redirectSpy;
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: 'customer-token',
          refreshToken: 'refresh-token',
          user: {
            id: 'user-1',
            email: 'owner@company.com',
            displayName: 'Owner',
            role: 'customer',
            createdAt: '2026-04-10T00:00:00.000Z',
          },
        }),
        {
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        },
      ),
    );

    render(<CustomerSignupRoute />);

    fireEvent.change(screen.getByPlaceholderText('Jane Operator'), {
      target: { value: 'Owner Name' },
    });
    fireEvent.change(screen.getByPlaceholderText('owner@company.com'), {
      target: { value: 'owner@company.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.click(screen.getByText('Set a custom workspace name (optional)'));
    fireEvent.change(screen.getByPlaceholderText('North America Support'), {
      target: { value: 'Ops Workspace' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3002/api/v1/auth/signup',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        }),
      );
      expect(redirectSpy).toHaveBeenCalledWith('/dashboard');
    });

    expect(
      window.sessionStorage.getItem('elite-message.customer.access-token'),
    ).toBe('customer-token');
  });
});
