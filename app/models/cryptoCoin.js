'use strict';
module.exports = (sequelize, DataTypes) => {
  const cryptoCoin = sequelize.define('cryptoCoin', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    coin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  });
  cryptoCoin.removeAttribute('id');
  return cryptoCoin;
};
