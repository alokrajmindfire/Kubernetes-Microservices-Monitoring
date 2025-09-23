import { CorsOptions } from 'cors'
import { HelmetOptions } from 'helmet'

const APP_CONFIG = {
  CORS_ORIGINS: (
    process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173'
  )
    .split(',')
    .map((origin) => origin.trim()),

  CORS_METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  CORS_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

export const CORS_CONF: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || APP_CONFIG.CORS_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: APP_CONFIG.CORS_METHODS,
  allowedHeaders: APP_CONFIG.CORS_HEADERS,
  credentials: true,
  optionsSuccessStatus: 200,
}

export const HELMET_CONFIG: HelmetOptions = {
  contentSecurityPolicy:
    process.env.NODE_ENV === 'production'
      ? {
          useDefaults: true,
          directives: {
            'default-src': ["'self'"],
            'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
            'img-src': ["'self'", 'data:', 'https:'],
          },
        }
      : false,
  frameguard: { action: 'deny' },
  xssFilter: true,
  hidePoweredBy: true,
  noSniff: true,
  referrerPolicy: { policy: 'no-referrer' },
}
