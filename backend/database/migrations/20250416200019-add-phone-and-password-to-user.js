'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Añadir columna phone (opcionalmente con valor por defecto)
    // await queryInterface.addColumn('users', 'phone', {
    //   type: Sequelize.STRING,
    //   allowNull: true // Cambia a false si es obligatorio
    // });

    // // Añadir columna password
    // await queryInterface.addColumn('users', 'password', {
    //   type: Sequelize.STRING,
    //   allowNull: false
    // });

    // // Hashear contraseñas existentes (si hay usuarios)
    // const users = await queryInterface.sequelize.query(
    //   'SELECT id FROM users;',
    //   { type: queryInterface.sequelize.QueryTypes.SELECT }
    // );

    // for (const user of users) {
    //   const hashedPassword = await bcrypt.hash('TempPassword123!', 10);
    //   await queryInterface.sequelize.query(
    //     `UPDATE users SET password = '${hashedPassword}' WHERE id = ${user.id}`
    //   );
    // }
  },

  async down(queryInterface) {
    // await queryInterface.removeColumn('users', 'phone');
    // await queryInterface.removeColumn('users', 'password');
  }
};