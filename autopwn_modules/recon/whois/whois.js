import https from 'https';

const performRequest = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'Accept': 'application/rdap+json' }
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(performRequest(response.headers.location));
      }

      let rawData = '';
      response.on('data', (chunk) => rawData += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (error) {
          reject({
            status: 'error',
            message: 'Invalid JSON response or domain not found'
          });
        }
      });
    }).on('error', (error) => {
      reject({
        status: 'error',
        message: error.message
      });
    });
  });
};

const lookup = async (domain) => {
  try {
    const domainParts = domain.split('.');
    const registrableDomain = domainParts.slice(-2).join('.');
    const tld = domainParts.pop().toLowerCase();

    const bootstrapData = await performRequest('https://data.iana.org/rdap/dns.json');
    const serviceMatch = bootstrapData.services.find(service => service[0].includes(tld));

    if (!serviceMatch) {
      return {
        status: 'error',
        message: `TLD .${tld} not supported by RDAP`
      };
    }

    const baseUrl = serviceMatch[1][0];
    return await performRequest(`${baseUrl}domain/${registrableDomain}`);
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      target: domain
    };
  }
};

export default lookup;
