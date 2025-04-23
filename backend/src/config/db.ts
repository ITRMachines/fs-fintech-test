import { Sequelize } from 'sequelize';
import 'dotenv/config';
import { initUser } from '../models/user';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5434', 10),
  database: process.env.POSTGRES_DB || 'finsim',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
});
console.log(sequelize);

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();

    console.log('Connection has been established successfully.');

    initUser(sequelize);
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize;