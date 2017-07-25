const request = require('request');
const API_URL = process.env.API_URL;

module.exports = (app) => {
  console.log(`Using ${API_URL} for API requests.`);

  app.get('/api/*', (req, res) => {
    let options = {
      method: 'GET',
      url: API_URL + req.url
    };

    console.log(`GET ${options.url}`);

    /* Send request and pipe back response */
    request(options)
      .on('error', (err) => res.status(500).send())
      .pipe(res);
  });
};
