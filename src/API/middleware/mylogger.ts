import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  console.log('\n::::::authorization::::::');
  console.log(req.headers.authorization);

  console.log('\n::::::req.query::::::');
  console.log(req.query);

  console.log('\n::::::req.body::::::');
  console.log(req.body);

  console.log('\n::::::req.params::::::');
  console.log(req.params);

  console.log('\n::::::req.cookies::::::');
  console.log(req.cookies);
  next();
};
