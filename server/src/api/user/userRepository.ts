import UserSchema from "./userModel";

class UserRepository {
  async createUser(user: any) {
    return UserSchema.create(user);
  }

  async findUsers() {
    return UserSchema.find({});
  }
  async findUser(id: any) {
    return UserSchema.findById(id);
  }

  async deleteUser(id: any) {
    return UserSchema.findByIdAndDelete(id);
  }

  async updateUser(id: any) {
    return UserSchema.findByIdAndUpdate(id);
  }
}

export default new UserRepository;
