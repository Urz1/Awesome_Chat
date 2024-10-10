import UserRepository from "./userRepository";
import { Request, response, Response } from "express";

class UserController {
  public async getUser(req: Request, res: Response) {
    const users = await UserRepository.findUsers();

    res.send(200).json(users);
  }
  public async FindUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await UserRepository.findUser(id);

    res.send(200).json(user);
  }
  public async DeleteUser(req: Request, res: Response) {
    const { id } = req.params;
    await UserRepository.deleteUser(id);
    res.send(200).json("successfully deleted ");
  }
  public async UpdateUser(req: Request, res: Response) {
    const { id } = req.params;
    await UserRepository.deleteUser(id);

    res.send(200).json("Successfully Updated");
  }
}

export default UserController
