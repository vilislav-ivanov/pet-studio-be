import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
  maxAge: 900000000,
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};
