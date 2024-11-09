import { UserProvider } from '@/context/UserContext';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import App from './App';

describe('Check App Overall', () => {
  test('Should title', async () => {
    render(
      <UserProvider>
        <App />
      </UserProvider>
    );

    // Use `waitFor` to ensure the message appears after any async updates.
    await waitFor(
      () => {
        const message = screen.getByText('OpenHands');
        expect(message).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });
});
