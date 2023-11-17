import { Request, Response, NextFunction } from 'express';
import { Config } from '../config';

export function resError(req: Request, res: Response, next: NextFunction) {
  res.error = function (messageOrError:string | any, code: number = 400, issues: any = [], showToUser: boolean = true) {
    if (typeof messageOrError === 'string') {
      const message:string = messageOrError;

      return res.status(code).json({
        success: false,
        code,
        message: message || 'Server error',
        issues,
        showToUser,
      });
    } else {
      const err = messageOrError;

      const copy = Object.assign({}, err);
      if (Config.isProduction) {
        delete copy.stack;
      }

      try {
        return this.json(copy);
      } catch (e: any) {
        return this.json({ message: copy.message, status: copy.status });
      }
    }
  };
  next();
}

declare global {
  namespace Express {
    export interface Response {
      error(message:string, code:number, issues?: any, showToUser?: any):Response;
      error(error:any):Response;
      success(obj?: any, status?: number):Response;
    }
  }
}
