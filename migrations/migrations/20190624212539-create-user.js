'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('users', {
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING
      },
      preference_money: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: queryInterface => queryInterface.dropTable('users')
};
