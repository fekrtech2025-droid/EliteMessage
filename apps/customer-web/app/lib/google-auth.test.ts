import { describe, expect, it } from 'vitest';
import {
  buildGoogleAuthorizationUrl,
  parseGoogleAuthCallbackHash,
} from './google-auth';

describe('customer google auth helpers', () => {
  it('builds the Google authorization URL against the API origin', () => {
    expect(buildGoogleAuthorizationUrl('login')).toBe(
      'http://localhost:3002/api/v1/auth/google/authorize?mode=login',
    );
    expect(buildGoogleAuthorizationUrl('signup')).toBe(
      'http://localhost:3002/api/v1/auth/google/authorize?mode=signup',
    );
  });

  it('parses a successful callback fragment', () => {
    expect(
      parseGoogleAuthCallbackHash('#mode=signup&access_token=customer-token'),
    ).toEqual({
      kind: 'success',
      mode: 'signup',
      accessToken: 'customer-token',
    });
  });

  it('parses an error callback fragment', () => {
    expect(
      parseGoogleAuthCallbackHash(
        '#mode=login&error_code=google_auth_failed&error_message=Google%20login%20failed',
      ),
    ).toEqual({
      kind: 'error',
      mode: 'login',
      errorCode: 'google_auth_failed',
      errorMessage: 'Google login failed',
    });
  });
});
