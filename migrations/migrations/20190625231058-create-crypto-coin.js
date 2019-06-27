'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('crypto_coin', {
        user_id: {
          allowNull: true,
          foreignKey: true,
          type: Sequelize.INTEGER,
          references: {
            model: 'user',
            key: 'id'
          }
        },
        coin: {
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
      })
      .then(() => {
        queryInterface.addConstraint('crypto_coins', ['user_id', 'coin'], {
          type: 'primary key',
          name: 'coins-pk'
        });
      }),
  down: queryInterface => queryInterface.dropTable('crypto_coin')
};
