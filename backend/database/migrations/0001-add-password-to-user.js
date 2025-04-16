'use strict';


module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('users','password', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'changename',
      });
    },
  
    down: async (queryInterface) => {
      await queryInterface.remoColumn('users', 'password');
    },
  };