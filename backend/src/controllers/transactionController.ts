// controllers/transactionController.ts
import { Request, Response } from 'express';
import  sequelize  from '../config/db';
import  Transaction from '../models/transaction';
import User from '../models/user';

export const deposit = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;

  const t = await sequelize.transaction(); // Inicia transacción

  try {
    // 1. Registrar la transacción
    const transaction = await Transaction.create({
      userId,
      amount,
      type: 'deposit',
      status: 'completed'
    }, { transaction: t });

    // 2. Actualizar el saldo del usuario (atómico)
    const [updated] = await User.update(
      { balance: sequelize.literal(`balance + ${amount}`) },
      { 
        where: { id: userId },
        transaction: t 
      }
    );

    if (updated !== 1) {
      throw new Error('User not found');
    }

    // 3. Confirmar transacción
    await t.commit();

    // 4. Obtener usuario actualizado
    const user = await User.findByPk(userId);
    
    res.json({
      success: true,
      newBalance: user?.balance,
      transactionId: transaction.id
    });

  } catch (error) {
    await t.rollback();
    console.error('Deposit error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Transaction failed'
    });
  }
};