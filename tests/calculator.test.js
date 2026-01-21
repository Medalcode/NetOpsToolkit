
import { calculateVLSM, calculateTotalRequired, calculateTotalAvailable } from '../src/js/calculator.js';
// We need to mock converters because the relative import path in calculator.js might be tricky in Jest environment 
// without proper module mapping, or we can rely on Jest to resolve it if configured correctly.
// Let's try to import converters directly to see if they work, otherwise we might need to mock.
// Actually, since we are testing 'calculator.js' which imports 'converters.js', integration test is fine.

describe('VLSM Calculator Core Logic', () => {

    describe('calculateTotalAvailable', () => {
        test('should return correct IPs for /24', () => {
            expect(calculateTotalAvailable(24)).toBe(256);
        });
        test('should return correct IPs for /30', () => {
            expect(calculateTotalAvailable(30)).toBe(4);
        });
        test('should return correct IPs for /32', () => {
            expect(calculateTotalAvailable(32)).toBe(1);
        });
    });

    describe('calculateTotalRequired', () => {
        test('should calculate total required space correctly including overhead', () => {
             // 50 hosts -> needs 64 block (6 bits: 2^6=64)
             // 20 hosts -> needs 32 block (5 bits: 2^5=32)
             // Total = 96
            expect(calculateTotalRequired([50, 20])).toBe(96);
        });

        test('should handle small requirements', () => {
            // 2 hosts -> needs 4 block (/30)
            expect(calculateTotalRequired([2])).toBe(4);
        });
    });

    describe('calculateVLSM Integration', () => {
        // Test case: 192.168.1.0/24 with requirements 50, 20
        // Blocks needed:
        // 50 hosts: needs /26 (64 addresses). Range: .0 - .63
        // 20 hosts: needs /27 (32 addresses). Range: .64 - .95
        
        const baseIP = '192.168.1.0';
        const prefix = 24;
        const hosts = [50, 20];
        
        const results = calculateVLSM(baseIP, prefix, hosts);

        test('should return correct number of subnets', () => {
            expect(results).toHaveLength(2);
        });

        test('should calculate first subnet correctly (50 hosts)', () => {
            const s1 = results[0];
            expect(s1.hostsRequested).toBe(50);
            expect(s1.prefix).toBe(26);
            expect(s1.network).toBe('192.168.1.0');
            expect(s1.broadcast).toBe('192.168.1.63');
            expect(s1.mask).toBe('255.255.255.192');
            expect(s1.hostsAvailable).toBe(62); // 64 - 2
        });

        test('should calculate second subnet correctly (20 hosts)', () => {
            // Should start right after first one
            const s2 = results[1];
            expect(s2.hostsRequested).toBe(20);
            expect(s2.prefix).toBe(27);
            expect(s2.network).toBe('192.168.1.64');
            expect(s2.broadcast).toBe('192.168.1.95');
            expect(s2.mask).toBe('255.255.255.224');
            expect(s2.hostsAvailable).toBe(30); // 32 - 2
        });

        test('should handle host requirements that utilize full remaining space', () => {
             // Case: 192.168.1.0/24. 
             // Req: 126 hosts (needs /25, .0-.127)
             // Req: 60 hosts (needs /26, .128-.191)
             // Req: 60 hosts (needs /26, .192-.255) -> Fits exactly!
             const res = calculateVLSM('192.168.1.0', 24, [126, 60, 60]);
             expect(res).toHaveLength(3);
             expect(res[2].broadcast).toBe('192.168.1.255');
        });
    });
});
