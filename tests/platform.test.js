/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { storage } from '../src/platform/storage.js';
import { platformFetch } from '../src/platform/fetch.js';
import { writeText } from '../src/platform/clipboard.js';

describe('Platform Adapters Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe('Storage Adapter', () => {
    test('storage.set and storage.get persist and retrieve JSON object correctly', () => {
      const payload = { key: 'gemini', active: true };
      storage.set('test_key', payload);
      expect(storage.get('test_key')).toEqual(payload);
    });

    test('storage.get returns null for missing key', () => {
      expect(storage.get('non_existent')).toBeNull();
    });

    test('storage.remove deletes key from localStorage', () => {
      storage.set('to_remove', 'value');
      expect(storage.get('to_remove')).toBe('value');
      storage.remove('to_remove');
      expect(storage.get('to_remove')).toBeNull();
    });

    test('storage handling returns null gracefully on localStorage errors', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError: Access is denied');
      });
      expect(storage.get('any_key')).toBeNull();
    });
  });

  describe('Fetch Adapter', () => {
    test('platformFetch wraps global fetch API', async () => {
      const mockResponse = { ok: true, json: async () => ({ status: 'ok' }) };
      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const res = await platformFetch('https://api.example.com/data');
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', undefined);
      expect(await res.json()).toEqual({ status: 'ok' });
    });
  });

  describe('Clipboard Adapter', () => {
    test('writeText delegates to navigator.clipboard.writeText when available', async () => {
      const writeTextMock = jest.fn().mockResolvedValue(true);
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      });

      await writeText('Hello NetOps');
      expect(writeTextMock).toHaveBeenCalledWith('Hello NetOps');
    });
  });
});
