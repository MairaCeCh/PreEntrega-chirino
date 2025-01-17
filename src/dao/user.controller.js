import userModel from "./models/user.model.js";

class UserController {
  async getAll() {
    const users = await userModel.find();
    return users;
  } 

  async getById(id) {
    const user = await userModel.findById(id);
    return user;
  }
 
  async create(data) {
    const user = await userModel.create(data);
    return user;
  }

  async update(id, data) {
    const userUpdate = await userModel.findByIdAndUpdate(id, data, {
        new: true,
    });
    return userUpdate;
}
    async deleteOne(id) {  
        const user = await userModel.findByIdAndDelete (id,
            {status: false},
            {new: true});
            return user;
        }
    }


export const userController = new UserController();
