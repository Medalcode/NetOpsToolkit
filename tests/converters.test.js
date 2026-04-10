import {
  ipToDecimal,
  decimalToIP,
  prefixToMask,
  getNetworkAddress
} from '../src/core/convert.js';

describe('IP Conversion Core Functions', () => {

  describe('ipToDecimal', () => {
    test('should convert valid IPv4 dotted-decimal to decimal integers', () => {
      expect(ipToDecimal('192.168.1.1')).toBe(3232235777);
      expect(ipToDecimal('10.0.0.1')).toBe(167772161);
      expect(ipToDecimal('0.0.0.0')).toBe(0);
      expect(ipToDecimal('255.255.255.255')).toBe(4294967295);
    });
  });

  describe('decimalToIP', () => {
    test('should convert decimal integers to IPv4 dotted-decimal strings', () => {
      expect(decimalToIP(3232235777)).toBe('192.168.1.1');
      expect(decimalToIP(167772161)).toBe('10.0.0.1');
      expect(decimalToIP(0)).toBe('0.0.0.0');
      expect(decimalToIP(4294967295)).toBe('255.255.255.255');
    });
  });

  describe('prefixToMask', () => {
    test('should return correct decimal mask for CIDR prefixes', () => {
      expect(prefixToMask(24)).toBe('255.255.255.0');
      expect(prefixToMask(16)).toBe('255.255.0.0');
      expect(prefixToMask(8)).toBe('255.0.0.0');
      expect(prefixToMask(30)).toBe('255.255.255.252');
      expect(prefixToMask(32)).toBe('255.255.255.255');
      expect(prefixToMask(0)).toBe('0.0.0.0');
    });
  });

  describe('getNetworkAddress', () => {
    test('should calculate the base network address given IP and prefix', () => {
      expect(getNetworkAddress('192.168.1.100', 24)).toBe('192.168.1.0');
      expect(getNetworkAddress('172.16.50.4', 16)).toBe('172.16.0.0');
      expect(getNetworkAddress('10.8.4.150', 8)).toBe('10.0.0.0');
      expect(getNetworkAddress('192.168.1.5', 30)).toBe('192.168.1.4');
    });
  });
});
