export type RedisConfigs = {
  // ? AUTH
  ACCESS_TOKEN: string;
  ACCESS_TOKEN_EXPIRY_IN_MINUTES: string;

  // ? EMAIL
  HOST: string;
  PORT: string;
  AUTH_USER: string;
  AUTH_PASS: string;

  // ? SMS
  SMS_ENDPOINT: string;
  SMS_API_KEY: string;
  SMS_PARTNER_ID: string;
  SMS_SENDER_ID: string;

  // ? SFTP
  REMOTE_PATH: string;
};
