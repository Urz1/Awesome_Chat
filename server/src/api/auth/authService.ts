import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";
import bcrypt from "bcryptjs";
import UserService from "../user/userService";
import { env } from "@/common/utils/envConfig";

configDotenv();
const app = express();
app.use(express.json());



const AuthService = new UserService(new userRepository());

const createAccessToken = (user: any) => {
  return jwt.sign({ id: user._id, email: user.email }, env.JWT_ACCESS_TOKEN, {
    expiresIn: "10m",
  });
};

const createRefreshToken = (user: any) => {
  return jwt.sign({ id: user._id }, env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

class authController {
  public async register(req: Request, res: Response) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const newUser = await AuthService.CreateUser({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
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
    const { firstname, password, email } = req.body;

    const user = await AuthService.getUserByEmail(email);
    console.log(email);
    if (!user) return res.status(400).json("User not found");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json("Invalid password");

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await user.save();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  }


  public async refreshT(req: Request, res: Response) {
    if (req.cookies?.jwt) {
      const refreshToken = req.cookies.jwt;
      console.log(refreshToken);
      jwt.verify(
        refreshToken,
        env.REFRESH_TOKEN,
        async (err: any, decoded: any) => {
          if (err) {
            return res.status(406).json({ message: "Unauthorized" });
          } else {
            const refreshUser = new userRepository();
            const user = await refreshUser.findUser(decoded.id);
            const NewAccesToken = createAccessToken(user);
            return res.json({ accessToken: NewAccesToken }).status(200);
          }
        }
      );
    } else {
      return res.status(406).json({ message: "Unauthorized" });
    }
  }


  public async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) return res.sendStatus(401);

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken");
    res.status(204).json("Logout Success");
  }
}


export default new authController();
