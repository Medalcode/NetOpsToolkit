/**
 * @jest-environment jsdom
 */

import { calculateStatistics, formatStatisticsSummary } from '../src/ui/shared/statistics.js';
import { addToHistory, getHistory, clearHistory, removeFromHistory, getHistoryStats } from '../src/ui/shared/history.js';
import { initTheme, getCurrentTheme } from '../src/ui/shared/theme.js';
import { addIPValidation } from '../src/ui/shared/form-handlers.js';

describe('Shared Services & Utilities Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  describe('Statistics Utility', () => {
    test('calculateStatistics and formatStatisticsSummary format metrics correctly', () => {
      const subnets = [
        { blockSize: 64, hostsRequested: 50, hostsAvailable: 62, utilizationPercent: '80.65' }
      ];
      const stats = calculateStatistics(subnets, 256);
      const summary = formatStatisticsSummary(stats);
      expect(summary).toHaveLength(9);
      expect(summary[1]).toContain('256 IPs');
      expect(summary[2]).toContain('64 IPs (25.00%)');
    });
  });

  describe('History Management', () => {
    test('addToHistory saves calculation and getHistory retrieves it', () => {
      clearHistory();
      addToHistory('192.168.1.0/24', '50, 20', [{ network: '192.168.1.0' }], { totalRequired: 96, totalAvailable: 256 });
      const items = getHistory();
      expect(items).toHaveLength(1);
      expect(items[0].network).toBe('192.168.1.0/24');
      expect(items[0].hosts).toBe('50, 20');
    });

    test('removeFromHistory removes specific item by ID', () => {
      clearHistory();
      const item = addToHistory('10.0.0.0/8', '100', [], { totalRequired: 128, totalAvailable: 16777216 });
      expect(getHistory()).toHaveLength(1);
      removeFromHistory(item.id);
      expect(getHistory()).toHaveLength(0);
    });

    test('getHistoryStats calculates correct aggregate metrics', () => {
      clearHistory();
      addToHistory('192.168.1.0/24', '50', [{ network: '192.168.1.0' }], { totalRequired: 64, totalAvailable: 256 });
      addToHistory('192.168.1.0/24', '30', [{ network: '192.168.1.64' }], { totalRequired: 32, totalAvailable: 256 });
      const stats = getHistoryStats();
      expect(stats.totalCalculations).toBe(2);
      expect(stats.mostUsedNetwork).toBe('192.168.1.0');
    });
  });

  describe('Theme Manager', () => {
    test('initTheme initializes theme manager without throwing', () => {
      expect(() => initTheme()).not.toThrow();
      expect(['dark', 'light', 'auto']).toContain(getCurrentTheme());
    });
  });

  describe('Form Handlers', () => {
    test('addIPValidation updates input styling on input event', () => {
      const container = document.createElement('div');
      const input = document.createElement('input');
      input.id = 'test-ip-input';
      container.appendChild(input);
      document.body.appendChild(container);

      addIPValidation(input);

      input.value = '192.168.1.1';
      input.dispatchEvent(new Event('input'));
      expect(input.classList.contains('border-green-500')).toBe(true);

      input.value = 'invalid.ip.address';
      input.dispatchEvent(new Event('input'));
      expect(input.classList.contains('border-red-500')).toBe(true);
    });
  });
});
