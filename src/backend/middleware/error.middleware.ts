import { Request, Response, NextFunction } from 'express';
import path from 'node:path';

// Keep diagnostic messages while removing request values, SQL and filesystem paths.
export function safeErrorLog(err: any, req: Request, status: number) {
  const secrets = new Set<string>();
  const collect = (value: any, depth = 0) => {
    if (depth > 5) return;
    if (typeof value === 'string' && value) secrets.add(value);
    else if (Array.isArray(value)) value.forEach(item => collect(item, depth + 1));
    else if (value && typeof value === 'object') Object.values(value).forEach(item => collect(item, depth + 1));
  };

  collect(req.body);
  collect(req.query);
  collect(req.params);
  collect(req.headers);
  if (req.headers.authorization) {
    secrets.add(req.headers.authorization);
    secrets.add(req.headers.authorization.replace(/^Bearer\s+/i, ''));
  }

  let message = typeof err.message === 'string' ? err.message : 'Unknown application failure';
  if (err.type === 'entity.parse.failed') message = 'Malformed JSON request';
  if (err.type === 'entity.too.large') message = 'Request body limit exceeded';

  // SQL errors can embed bound customer data that is absent from the request.
  if (/SQLITE|\b(?:insert into|select .+ from|update .+ set|delete from)\b/i.test(message)) message = 'Database operation failed';

  for (const secret of [...secrets].sort((a, b) => b.length - a.length)) message = message.split(secret).join('[redacted]');
  message = message.replace(/Bearer\s+\S+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/gi, '[redacted]')
    .replace(/(?:password|token|secret|authorization)\s*[=:]\s*\S+/gi, '[redacted]')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[redacted]')
    .replace(/(?:[A-Za-z]:)?\/[\w./-]+/g, '[path]').replace(/[\r\n\t]/g, ' ').slice(0, 300);

  // Stack source locations are useful without arbitrary first-line messages/full paths.
  const stack = typeof err.stack === 'string' ? err.stack.split('\n').slice(1, 7).map((line: string) => {
    const match = line.match(/(?:\(|\s)([^()\s]+):(\d+):(\d+)\)?$/);
    return match ? `${path.basename(match[1])}:${match[2]}:${match[3]}` : '[frame omitted]';
  }) : [];

  return { timestamp: new Date().toISOString(), method: req.method, path: req.route?.path ? `${req.baseUrl || ''}${req.route.path}` : '[unmatched request]', status, message, stack };
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 500 ? err.status : 500;
  console.error(JSON.stringify(safeErrorLog(err, req, status)));

  if (res.headersSent) {
    next(err);
    return;
  }
  const message = status === 500 ? 'Internal server error' : status === 413 ? 'Request body too large' : status === 415 ? 'Unsupported media type' : 'Invalid request';
  res.status(status).json({ error: message });
};
