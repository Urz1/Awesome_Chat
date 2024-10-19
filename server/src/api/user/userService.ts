import UserRepository from "./userRepository";

class UserService {
  private _userRepo: UserRepository;
    
  constructor(usrRepository: UserRepository) {
    this._userRepo = usrRepository;
  }
  async CreateUser(user:any){
    return this._userRepo.createUser(user)
  }
  async getAllUsers() {
    return this._userRepo.findUsers();
  }

  async getUserById(id: string) {
    return this._userRepo.findUser(id);
  }

  async getUserByEmail(email: string) {
    return this._userRepo.findByEmail(email);
  } 

  async updateUser(id: string, user: any) {
    return this._userRepo.updateUser(id, user);
  }

  async deleteUser(id: string) {
    return this._userRepo.deleteUser(id);
  }
}

export default UserService;
