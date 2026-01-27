import { buildDnsUrl, getDnsTypeName } from '../src/js/tools/dns-core.js';

describe('dns-core utilities', () => {
  test('buildDnsUrl constructs correct query for google resolver', () => {
    const url = buildDnsUrl('google', 'example.com', 'A');
    expect(url.searchParams.get('name')).toBe('example.com');
    expect(url.searchParams.get('type')).toBe('A');
    expect(url.origin).toBe('https://dns.google');
  });

  test('buildDnsUrl constructs correct query for cloudflare resolver', () => {
    const url = buildDnsUrl('cloudflare', 'sub.example.org', 'AAAA');
    expect(url.searchParams.get('name')).toBe('sub.example.org');
    expect(url.searchParams.get('type')).toBe('AAAA');
    expect(url.origin).toBe('https://cloudflare-dns.com');
  });

  test('getDnsTypeName maps known type ids and returns fallback otherwise', () => {
    expect(getDnsTypeName(1)).toBe('A');
    expect(getDnsTypeName(28)).toBe('AAAA');
    expect(getDnsTypeName(9999)).toBe(9999);
  });
});
