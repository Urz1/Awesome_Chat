import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";
import bcrypt from "bcryptjs";

configDotenv();
const app = express();
app.use(express.json());
const Jaccess_Token = process.env.JWT_ACCESS_TOKEN || " ";
const Raccess_Token = process.env.REFRESH_TOKEN || " ";

const createAccessToken = (user: any) => {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, Jaccess_Token, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (user: any) => {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, Raccess_Token, {
    expiresIn: "7d",
  });
};

class authController {
  public async register(req: Request, res: Response) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const newUser = await userRepository.createUser({
        firstname: req.body.firstname,
        lastname:req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: error });
    }
  }

  public async login(req: Request, res: Response) {
    const { firstname, password, _id } = req.body;

    const user = await userRepository.findUser({ _id });
    if (!user) return res.status(400).json("User not found");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json("Invalid password");

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.json({ accessToken });
  }

  public async Token(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken || req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    jwt.verify(
      refreshToken,
      Raccess_Token as string,
      async (err: any, decoded: any) => {
        if (err) return res.sendStatus(403);

        const payload = decoded as { _id: string; isAdmin: String };
        const userId = payload._id;

        try {
          const user = await userRepository.findUser(userId);
          if (!user) return res.sendStatus(403);

          if (user.refreshToken !== refreshToken) return res.sendStatus(403);
          const newAccessToken = createAccessToken(user);
          res.json({ accessToken: newAccessToken });
        } catch (err) {
          res.sendStatus(500);
        }
      }
    );
  }

  public async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    jwt.verify(
      refreshToken,
      Raccess_Token as string,
      async (err: any, decoded: any) => {
        const payload = decoded as { _id: string; isAdmin: String };
        const userId = payload._id;
        await userRepository.updateUser(userId, { refreshToken: null });
      }
    );
    res.clearCookie("refreshToken");
    res.sendStatus(204);
  }
}

export default new authController();
