/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { fuzzySearch } from '../src/ui/shared/fuzzy-search.js';
import { initCommandPalette } from '../src/ui/components/command-palette.js';

describe('UX Features & Command Palette Suite (v4.2.5)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Fuzzy Search Utility', () => {
    const mockList = [
      { id: 'vlsm', name: 'VLSM Subnet Calculator' },
      { id: 'dns', name: 'DNS Lookup (DoH)' },
      { id: 'ports', name: 'Port Reference' },
      { id: 'acl', name: 'ACL Builder' }
    ];

    test('Returns full list when query is empty', () => {
      expect(fuzzySearch(mockList, '', 'name')).toHaveLength(4);
    });

    test('Filters exact matches correctly', () => {
      const results = fuzzySearch(mockList, 'DNS', 'name');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('dns');
    });

    test('Filters fuzzy subsequence matches (e.g. "vl" -> VLSM)', () => {
      const results = fuzzySearch(mockList, 'vl', 'name');
      expect(results.some(r => r.id === 'vlsm')).toBe(true);
    });
  });

  describe('Command Palette Component', () => {
    test('initCommandPalette injects modal into DOM and triggers callback on selection', () => {
      const onSelectMock = jest.fn();
      const palette = initCommandPalette(onSelectMock);

      const modal = document.getElementById('cmd-palette-modal');
      expect(modal).not.toBeNull();

      palette.openPalette();
      expect(modal.classList.contains('hidden')).toBe(false);

      const firstItem = modal.querySelector('.cmd-item');
      expect(firstItem).not.toBeNull();
      firstItem.click();

      expect(onSelectMock).toHaveBeenCalledWith('tool-topology');
    });
  });
});
