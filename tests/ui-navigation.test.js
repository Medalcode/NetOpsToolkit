/**
 * @jest-environment jsdom
 */

import { showErrorNotification, showSuccessNotification } from '../src/ui/shared/error-handler.js';
import { showToast } from '../src/ui/shared/ui-engine.js';

describe('UI Shared & Notifications Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('showToast creates container and displays message', () => {
    showToast('Test Toast Notification', 'success', 1000);
    const container = document.getElementById('toast-container');
    expect(container).not.toBeNull();
    expect(container.textContent).toContain('Test Toast Notification');
  });

  test('showErrorNotification appends error alert to body', () => {
    showErrorNotification('Validation Failed Test', 'error');
    expect(document.body.textContent).toContain('Validation Failed Test');
  });

  test('showSuccessNotification appends success alert to body', () => {
    showSuccessNotification('Operation Successful');
    expect(document.body.textContent).toContain('Operation Successful');
  });
});
