import { Request, Response, NextFunction } from "express";
import { decryptData, encryptData } from "../services/encryptionService";

export const encryptionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers["x-encrypted"] !== "true") return next();

  try {
    if (req.body?.data) req.body = decryptData(req.body.data);
  } catch {
    return res.status(400).json({ message: "Invalid or tampered payload" });
  }

  const json = res.json.bind(res);
  res.json = (body: any) => json({ data: encryptData(body) });

  next();
};