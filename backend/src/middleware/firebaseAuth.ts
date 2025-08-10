import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export async function firebaseAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization || "";

  const match = authHeader.match(/^Bearer (.*)$/);
  if (!match) {
    return res.status(401).json({ error: "No authorization" });
  }
  const idToken = match[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error("verifyIdToken error:", err);
    return res
      .status(401)
      .json({ error: "Unauthorized: invalid or expired token" });
  }
}
