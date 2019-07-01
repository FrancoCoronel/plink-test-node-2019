'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      field: 'last_name'
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      isAlphanumeric: true
    },
    preferenceMoney: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      field: 'preference_money'
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
  return user;
};
