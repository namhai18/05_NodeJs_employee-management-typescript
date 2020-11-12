import ENV from '../configs/env';
import MYSQL from '../main/database/mysql/mysqlService';

const Crypto = require('cryptojs').Crypto;

export const createDumpData = async () => {
  const adminRole = await MYSQL.userRoleService.findOrCreate({
    where: {
      role: 'admin',
    },
    defaults: {
      role: 'admin',
    },
  });

  const userRole = await MYSQL.userRoleService.findOrCreate({
    where: {
      role: 'user',
    },
    defaults: {
      role: 'user',
    },
  });

  MYSQL.userService.findOrCreate({
    where: {
      username: 'admin',
    },
    defaults: {
      userRoleId: adminRole[0].id,
      username: 'admin',
      password: Crypto.AES.encrypt('admin', ENV.CRYPTO_SECRET),
    },
  });

  MYSQL.userService.findOrCreate({
    where: {
      username: 'user',
    },
    defaults: {
      userRoleId: userRole[0].id,
      username: 'user',
      password: Crypto.AES.encrypt('user', ENV.CRYPTO_SECRET),
    },
  });
};
