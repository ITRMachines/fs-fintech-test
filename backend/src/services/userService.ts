import User from '../models/user';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

export const getAllUsers = async () => {
  return await User.findAll();
};

export const getUserById = async (id: number) => {
  return await User.findByPk(id);
};

export const createUser = async (userData: any) => {
  return await User.
create(userData);
};

export const updateUser = async (id: number, userData: any) => {
  const user = await User.findByPk(id);
  if (user) {
    return await user.update(userData);
  }
  return null;
};

export const deleteUser = async (id: number) => {
  const user = await User.findByPk(id);
  if (user) {
    await user.destroy();
    return true;
  }
  return false;
};

export const loginUser = async (emailPhone: string, password: string) => {

  const user = await User.findOne({ where: { email: emailPhone } });
  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return user;

}