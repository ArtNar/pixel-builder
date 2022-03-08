import jwt from "jsonwebtoken";

export const getUserIdFromToken = (token?: string) => {
  const user = token ? jwt.decode(token) : null;
  const userId = user && typeof user === "object" && user.id;
  return userId;
};
