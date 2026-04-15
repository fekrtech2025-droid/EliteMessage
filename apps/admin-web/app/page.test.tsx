import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AdminHomePage from './page';

describe('admin home page', () => {
  it('renders the admin operations heading', () => {
    render(<AdminHomePage />);
    expect(screen.getByText('Admin Operations Console')).toBeTruthy();
  });
});
