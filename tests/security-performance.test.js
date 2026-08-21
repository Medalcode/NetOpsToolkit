/**
 * @jest-environment jsdom
 */

import { escapeHtml } from '../src/ui/shared/utils.js';
import { storage } from '../src/platform/storage.js';

describe('Security & Performance Assurance Suite (v4.2.0)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('DOM XSS Sanitization (escapeHtml)', () => {
    test('Escapes malicious script tags and HTML injection vectors', () => {
      const maliciousPayload = '<script>alert("xss")</script><img src=x onerror=alert(document.cookie)>';
      const sanitized = escapeHtml(maliciousPayload);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).not.toContain('<img');
      expect(sanitized).toContain('&lt;script&gt;');
      expect(sanitized).toContain('&lt;img src=x onerror=alert(document.cookie)&gt;');
    });

    test('Escapes single and double quotes correctly', () => {
      const input = `description "Core-Router" & 'Backup'`;
      const sanitized = escapeHtml(input);
      expect(sanitized).toBe('description &quot;Core-Router&quot; &amp; &#39;Backup&#39;');
    });

    test('Handles empty, null, or non-string input safely', () => {
      expect(escapeHtml('')).toBe('');
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(escapeHtml(12345)).toBe('');
    });
  });

  describe('Storage Adapter Integration', () => {
    test('storage.set and storage.get operate correctly without throw', () => {
      storage.set('gemini_api_key', 'AIzaSyTestKey123');
      expect(storage.get('gemini_api_key')).toBe('AIzaSyTestKey123');

      storage.remove('gemini_api_key');
      expect(storage.get('gemini_api_key')).toBeNull();
    });
  });
});
