export default ({ env }) => ([
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            env('CDN_ORIGIN')
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            env('CDN_ORIGIN')
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
]);
