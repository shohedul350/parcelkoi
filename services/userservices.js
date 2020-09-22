import models from '../models/index';

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
  const User = models.User;
  const result = await User.deleteOne({ _id: id });
  return result;
};
