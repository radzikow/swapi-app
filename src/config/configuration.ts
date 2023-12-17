export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    debug_port: parseInt(process.env.APP_DEBUG_PORT, 10) || 3001,
  },
  db: {
    mongodb: {
      uri: process.env.DB_MONGODB_URI,
    },
  },
  cache: {
    ttl_seconds: parseInt(process.env.CACHE_TTL_SECONDS, 10) || 86400,
  },
  swapi: {
    url: process.env.SWAPI_URL,
  },
  default: {
    search: process.env.DEFAULT_SEARCH || '',
    pagination: {
      skip: parseInt(process.env.DEFAULT_PAGINATION_SKIP, 10) || 0,
      take: parseInt(process.env.DEFAULT_PAGINATION_TAKE, 10) || 10,
      takeMax: parseInt(process.env.DEFAULT_PAGINATION_TAKE_MAX, 10) || 100,
    },
  },
});
