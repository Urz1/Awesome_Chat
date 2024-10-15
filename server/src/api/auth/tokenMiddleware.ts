import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  const refreshToken = req.cookies["refreshToken"];
  const secretKey: string = process.env.JWT_ACCESS_TOKEN || "";

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(accessToken as string, secretKey) as {
      user: { id: string; isAdmin?: boolean };
    };
    (req as any).user = decoded.user;
    return next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const decoded = jwt.verify(refreshToken as string, secretKey) as {
        user: { id: string; isAdmin?: boolean };
      };

      const newAccessToken = jwt.sign({ user: decoded.user }, secretKey, {
        expiresIn: "1h",
      });

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("Authorization", newAccessToken)
        .send({ user: decoded.user });
    } catch (error) {
      return res.status(400).send("Invalid refresh token.");
    }
  }
};

export default authenticate;
