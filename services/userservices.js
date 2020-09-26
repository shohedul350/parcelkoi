import models from '../models/index';
import { NotFound } from '../utils/error';

export const saveUser = async (user) => {
  const model = new models.User(user);
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
  throw new NotFound(`User not found by the is:${id}`);
};

export const deleteById = async (id) => {
  const User = models.User;
  const user = await User.findById(id);

  if (user) {
    const result = await User.deleteOne({ _id: id });
    return result;
  }
  throw new NotFound(`User not found by the is:${id}`);
};
