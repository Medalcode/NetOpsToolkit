/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { idb } from '../src/platform/indexed-db.js';
import { initTopologyMapper } from '../src/ui/components/topology-mapper.js';

describe('Version 4.3.0 Features & Persistence Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  describe('IndexedDB Platform Adapter (idb)', () => {
    test('setItem and getItem fallback gracefully to localStorage in test env', async () => {
      await idb.setItem('test_topology_key', { nodes: 4, name: 'Core Net' });
      const retrieved = await idb.getItem('test_topology_key');
      expect(retrieved).toEqual({ nodes: 4, name: 'Core Net' });

      await idb.removeItem('test_topology_key');
      const empty = await idb.getItem('test_topology_key');
      expect(empty).toBeNull();
    });
  });

  describe('Network Topology Mapper Component', () => {
    test('initTopologyMapper renders canvas, nodes, and action buttons', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      initTopologyMapper(container);

      const svg = container.querySelector('#topo-svg');
      const nodesLayer = container.querySelector('#topo-nodes-layer');
      const btnAddRouter = container.querySelector('#btn-add-router');

      expect(svg).not.toBeNull();
      expect(nodesLayer).not.toBeNull();
      expect(btnAddRouter).not.toBeNull();

      // Verify default nodes render
      const nodes = nodesLayer.querySelectorAll('.topo-node');
      expect(nodes.length).toBeGreaterThan(0);
    });

    test('Adding a router node increases node count in DOM', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      initTopologyMapper(container);
      const nodesLayer = container.querySelector('#topo-nodes-layer');
      const initialCount = nodesLayer.querySelectorAll('.topo-node').length;

      const btnAddRouter = container.querySelector('#btn-add-router');
      btnAddRouter.click();

      const newCount = nodesLayer.querySelectorAll('.topo-node').length;
      expect(newCount).toBe(initialCount + 1);
    });
  });
});
