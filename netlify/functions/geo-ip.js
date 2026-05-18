exports.handler = async (event) => {
  const clientIp = event.headers['x-nf-client-connection-ip']
    || event.headers['client-ip']
    || event.headers['x-forwarded-for']?.split(',')[0].trim()
    || '127.0.0.1';

  try {
    const res = await fetch(`http://ip-api.com/json/${clientIp}?fields=query,city,region,country,org`);
    if (!res.ok) throw new Error(`ip-api returned ${res.status}`);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        ip: data.query || clientIp,
        city: data.city || "Unknown",
        region: data.region || "",
        country: data.country || "",
        org: data.org || "Unknown",
      }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        ip: clientIp,
        city: "Unavailable",
        region: "",
        country: "",
        org: "",
      }),
    };
  }
};
