const userService = require('../app/services/users');

const userTest = {
  username: 'userPlink',
  password: 'pruebas1234',
  firstName: 'Plink',
  lastName: 'Plink',
  preferenceMoney: 'USD'
};

const createUser = async () => {
  await userService.create(userTest);
  process.exit();
};

createUser();
