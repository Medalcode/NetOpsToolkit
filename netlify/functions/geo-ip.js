/**
 * GeoIP Function (Serverless)
 * Acts as a secure proxy to get client IP and Geo data.
 */
exports.handler = async (event, context) => {
  // Netlify provides client IP in headers
  const clientIp = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || '127.0.0.1';
  
  // Simulated Geo Data (In prod, you'd call MaxMind or similar backend service)
  // We simulate it here to avoid external API dependencies that break or require keys for this demo.
  // But purely getting the IP from the request headers is a true "Backend" task.
  
  const mockGeo = {
    ip: clientIp,
    city: "Unknown City",
    region: "Region",
    country: "Internet",
    org: "ISP"
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" // Allow CORS
    },
    body: JSON.stringify(mockGeo)
  };
};
