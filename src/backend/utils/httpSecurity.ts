import { RequestHandler } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export function allowedOrigins(env: NodeJS.ProcessEnv): string[] {
  const configured = env.CORS_ALLOWED_ORIGINS;
  if (configured === undefined || !configured.trim()) return env.NODE_ENV === 'production' ? [] : ['http://localhost:5173', 'http://127.0.0.1:5173'];
  return [...new Set(configured.split(',').map(value => {
    const origin = value.trim();
    let url: URL;
    try { url = new URL(origin); } catch { throw new Error('Invalid CORS_ALLOWED_ORIGINS configuration'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin || url.username || url.password || origin.includes('*')) throw new Error('Invalid CORS_ALLOWED_ORIGINS configuration');
    return origin;
  }))];
}
export function corsPolicy(env: NodeJS.ProcessEnv): RequestHandler[] {
  const origins = allowedOrigins(env);
  return [
    (req, res, next) => {
      res.vary('Origin');
      if (req.headers.origin && !origins.includes(req.headers.origin)) { res.status(403).json({error:'Origin not allowed'}); return; }
      next();
    },
    cors({origin: origins, credentials:false, methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders:['Content-Type','Authorization'], maxAge:600})
  ];
}
export const contentSecurityPolicy = {
  useDefaults:false,
  directives: {
    defaultSrc:["'self'"], scriptSrc:["'self'"],
    // React inline styles and react-hot-toast generated styles require this exception.
    styleSrc:["'self'", "'unsafe-inline'"], imgSrc:["'self'",'data:','blob:','https:'],
    fontSrc:["'self'"], connectSrc:["'self'"], objectSrc:["'none'"],
    baseUri:["'self'"], formAction:["'self'"], frameAncestors:["'none'"]
  }
};
export const loginLimiter = rateLimit({windowMs:15*60*1000,limit:10,skipSuccessfulRequests:true,standardHeaders:'draft-7',legacyHeaders:false,validate:{xForwardedForHeader:false},handler:(_req,res)=>{res.status(429).json({error:'Too many login attempts. Please try again later.'});}});
export const passwordLimiter = rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:'draft-7',legacyHeaders:false,validate:{xForwardedForHeader:false},handler:(_req,res)=>{res.status(429).json({error:'Too many password attempts. Please try again later.'});}});
export const privateResponse: RequestHandler = (_req,res,next) => { res.setHeader('Cache-Control','no-store'); next(); };
export const bodyType: RequestHandler = (req,res,next) => {
  const hasBody = Number(req.headers['content-length'] || 0) > 0 || !!req.headers['transfer-encoding'];
  if (hasBody && !req.is('application/json') && !req.is('application/x-www-form-urlencoded')) {res.status(415).json({error:'Unsupported media type'});return;}
  next();
};
