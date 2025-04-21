import { Request, Response } from 'express';
import User from '../models/user';
import * as userService from '../services/userService';
import { ok } from 'assert';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error)
 {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(Number(id));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    
    // Validación adicional (opcional)
    if (!userData.email || !userData.password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.message.includes('ya están registrados')) {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: 'Error al crear el usuario',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userData = req.body;
  try {
    const updatedUser = await userService.updateUser(Number(id), userData);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const success = await userService.deleteUser(Number(id));
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { emailPhone, password } = req.body;

  if (!emailPhone || !password) {
    return res.status(400).json({ 
      ok: false,
      error: 'Email/teléfono y contraseña son requeridos' 
    });
  }

  try {
    const user = await userService.loginUser(emailPhone, password);
    
    res.json({ 
      ok: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        // otros campos excepto password
      }
    });
    
  } catch (error: any) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 401;
    res.status(statusCode).json({ 
      ok: false,
      error: error.message 
    });
  }
};


// export const getBalance = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findByPk(req.user.id, {
//       attributes: ['id', 'balance']
//     });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json({ 
//       balance: user.balance 
//     });
//   } catch (error) {
//     console.error('Get balance error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };