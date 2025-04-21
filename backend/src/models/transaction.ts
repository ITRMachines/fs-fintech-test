// models/transaction.ts
import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../config/db';

class Transaction extends Model {
  declare id: string;
  declare userId: string;
  declare amount: number;
  declare type: 'deposit' | 'withdrawal';
  declare status: 'pending' | 'completed' | 'failed';
}

Transaction.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
}, {
  sequelize,
  tableName: 'transactions',
});

export default Transaction;