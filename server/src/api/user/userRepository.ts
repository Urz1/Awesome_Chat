import {UserModel} from "./userModel";

class UserRepository {

  async createUser(user: any) {
    return UserModel.create(user);
  }
  async findUsers() {
    return UserModel.find({});
  }
  async findUser(id: string) {
    return UserModel.findById(id);
  }
  async findByEmail(email: string) {
    return UserModel.findOne({email});
  }

  async deleteUser(id: string) {
    return UserModel.findByIdAndDelete(id);
  }

  async updateUser(id: string, user:any) {
    return UserModel.findByIdAndUpdate(id,user,{new:true});
  }

}

export default UserRepository;
