import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = get(req, 'user') as any;

  if (!user || !user.isAdmin) {
    return res.status(403).json({ user: 'require admin' });
  }

  return next();
}

export default requireAdmin;
