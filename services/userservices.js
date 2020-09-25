import models from '../models/index';
import { NotFound } from '../utils/error';

export const saveUser = async (user) => {
  const model = new models.User(
    { userName: user.userName, email: user.email, address: user.address },
  );
  const savedUser = await model.save();
  return savedUser;
};

export const getAllUsers = async () => {
  const User = models.User;
  const users = await User.find();
  return users;
};

export const update = async (user) => {
  const id = user._id;
  const User = models.User;
  const model = await User.findById(id);
  if (model) {
    model.username = user.username;
    model.save();
    return model;
  }
  return null;
};

export const deleteById = async (id) => {
  console.log(id)
  const User = models.User;
  const user = await User.findById({ _id: id });
  if (user) {
    const result = await User.deleteOne({ _id: id });
    return result;
  }
  return new NotFound(`User not found by the is:${id}`);
};
