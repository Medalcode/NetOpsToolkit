// Lógica pura de DNS: construcción de URL y utilidades
export function buildDnsUrl(resolver, domain, type) {
  const endpoints = {
    'google': 'https://dns.google/resolve',
    'cloudflare': 'https://cloudflare-dns.com/dns-query'
  };

  const base = endpoints[resolver] || endpoints.google;
  const url = new URL(base);
  url.searchParams.append('name', domain);
  url.searchParams.append('type', type);
  return url;
}

export function getDnsTypeName(typeId) {
  const types = { 1: 'A', 28: 'AAAA', 15: 'MX', 16: 'TXT', 2: 'NS', 5: 'CNAME', 6: 'SOA', 12: 'PTR' };
  return types[typeId] || typeId;
}
