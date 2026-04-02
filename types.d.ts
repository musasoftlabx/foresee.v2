type RedisConfigs = {
  // ? AUTH
  ACCESS_TOKEN: string;
  ACCESS_TOKEN_EXPIRY_IN_MINUTES: string;

  // ? EMAIL
  HOST: string;
  PORT: string;
  AUTH_USER: string;
  AUTH_PASS: string;

  // ? SFTP
  REMOTE_PATH: string;
};
