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
  try {
    // Verifica si el email o teléfono ya existen
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: userData.email },
          // { phoneNumber: userData.phoneNumber }
        ]
      }
    });

    if (existingUser) {
      throw new Error('El email o teléfono ya están registrados');
    }

    // Crea el usuario (el hook beforeCreate se encargará del hasheo)
    const user = await User.create(userData);
    
    // Elimina la contraseña del objeto devuelto
    const { password, ...userWithoutPassword } = user.get({ plain: true });
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Error en userService.createUser:', error);
    throw error;
  }
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

  const user = await User.findOne({ 
    where: { 
      [Op.or]: [
        { email: emailPhone },
        // { phone: emailPhone } // Si tienes campo 'phone' en tu modelo
      ]
    } 
  });

  if (!user) {
    throw new Error('Usuario no encontrado'); // Mejor para manejo de errores
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta');
  }

  // Elimina la contraseña del objeto devuelto por seguridad
  const userWithoutPassword = user.get({ plain: true });
  // delete userWithoutPassword.password;

  return userWithoutPassword;
};