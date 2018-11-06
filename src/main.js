import environment from './environment';
import { HttpClient } from 'aurelia-fetch-client';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  let container = aurelia.container;

  let httpClient = new HttpClient();

  httpClient.configure(config => {
    config
      .withBaseUrl((environment.debug) ? 'http://localhost:5000/api/' : '/api/')
      //.withBaseUrl('/api/')
      .withDefaults({
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'Fetch',
          'Access-Control-Allow-Origin': '*'
        }
      })
      .withInterceptor({
        request(request) {
          console.log(`Requesting ${request.method} ${request.url}`);
          return request;
        },
        response(response) {
          console.log(`Received ${response.status} ${response.url}`);
          return response;
        }
      });
  });

  container.registerInstance(HttpClient, httpClient);

  return aurelia.start().then(() => aurelia.setRoot());
}
