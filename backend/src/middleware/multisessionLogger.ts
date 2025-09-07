import { Request, Response, NextFunction } from "express";

export const multisessionLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Multisession Logger");
  next();
};
