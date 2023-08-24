import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tokenHeader = req.headers.authorization;
    if(tokenHeader && tokenHeader.startsWith('Bearer')){
      const token = tokenHeader.split(' ');
      console.log(token);
      if(!token){
        res.status(401)
        next(new Error('You must be provided token!'))
      }
      else{
        next()
      }

    }
    else{
      res.status(401)
      next(new Error('You must be logged in!'))
    }
  }
}
