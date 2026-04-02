declare global {
  declare module "*.ttf";
  declare module "*.css";
  declare module "@fontsource/*" {}
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API: string;
      NEXT_PUBLIC_FS_URL: string;
      REDIS_DB_HOST: string;
      REDIS_DB_PORT: number;
      REDIS_DB_USERNAME: string;
      REDIS_DB_PASSWORD: string;
      REDIS_KEY_EXPIRY: number;

      npm_package_name: string;
      MAX_FILE_SIZE: string;
      GOOGLE_AUTH_TOKEN: string;
      PASSCODE_EXPIRY: number;
      NEXT_PUBLIC_MINIMUM_PASSWORD_LENGTH: number;
      ACCESS_TOKEN_EXPIRY_IN_MINUTES: number;
    }
  }
}

export {};
