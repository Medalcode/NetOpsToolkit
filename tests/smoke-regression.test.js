/**
 * @jest-environment jsdom
 */

import { calculateVLSM, calculateTotalRequired, calculateTotalAvailable } from '../src/core/network.js';
import { validateIPAddress, validateCIDRPrefix, validateHosts, validateNetworkCapacity } from '../src/core/validate.js';
import { ipToDecimal, decimalToIP, prefixToMask, getNetworkAddress } from '../src/core/convert.js';

describe('Smoke & Regression Edge Case Suite', () => {
  describe('Edge Cases in IP Calculations & Conversions', () => {
    test('Handles extreme prefix /0 (Whole IPv4 Internet Space)', () => {
      expect(calculateTotalAvailable(0)).toBe(4294967296);
      expect(prefixToMask(0)).toBe('0.0.0.0');
      expect(getNetworkAddress('192.168.1.1', 0)).toBe('0.0.0.0');
    });

    test('Handles extreme prefix /32 (Single Host IP)', () => {
      expect(calculateTotalAvailable(32)).toBe(1);
      expect(prefixToMask(32)).toBe('255.255.255.255');
      expect(getNetworkAddress('10.0.0.5', 32)).toBe('10.0.0.5');
    });

    test('Validates boundary IPv4 addresses correctly', () => {
      expect(validateIPAddress('0.0.0.0')).toBe(true);
      expect(validateIPAddress('255.255.255.255')).toBe(true);
      expect(validateIPAddress('256.0.0.0')).toBe(false);
      expect(validateIPAddress('192.168.1')).toBe(false);
      expect(validateIPAddress('192.168.1.1.1')).toBe(false);
      expect(validateIPAddress('abc.def.ghi.jkl')).toBe(false);
    });

    test('Validates boundary CIDR prefixes correctly', () => {
      expect(validateCIDRPrefix(0)).toBe(true);
      expect(validateCIDRPrefix(32)).toBe(true);
      expect(validateCIDRPrefix(-1)).toBe(false);
      expect(validateCIDRPrefix(33)).toBe(false);
      expect(validateCIDRPrefix(NaN)).toBe(false);
    });
  });

  describe('Negative & Failure Scenarios', () => {
    test('validateHosts rejects empty array, negative numbers, or zeros', () => {
      expect(validateHosts([]).isValid).toBe(false);
      expect(validateHosts([-10, 20]).isValid).toBe(false);
      expect(validateHosts([0, 50]).isValid).toBe(false);
      expect(validateHosts([50, 30]).isValid).toBe(true);
    });

    test('validateNetworkCapacity detects network space exhaustion', () => {
      const availableForSlash24 = calculateTotalAvailable(24); // 256
      const requiredOverLimit = 300;
      const result = validateNetworkCapacity(availableForSlash24, requiredOverLimit);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('insuficiente');
    });

    test('calculateVLSM handles single host requirements gracefully', () => {
      const subnets = calculateVLSM('10.0.0.0', 24, [1]);
      expect(subnets).toHaveLength(1);
      expect(subnets[0].hostsRequested).toBe(1);
      expect(subnets[0].hostsAvailable).toBe(2); // /30 has 2 usable hosts
    });
  });

  describe('Conversion Roundtrip Consistency Regression Test', () => {
    test('ipToDecimal -> decimalToIP is completely lossless for sample IPs', () => {
      const sampleIPs = ['1.1.1.1', '8.8.8.8', '192.168.1.254', '10.255.0.1', '172.16.4.20'];
      sampleIPs.forEach(ip => {
        const dec = ipToDecimal(ip);
        const reconstructed = decimalToIP(dec);
        expect(reconstructed).toBe(ip);
      });
    });
  });
});
