import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "kitchenflo_super_secret";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};