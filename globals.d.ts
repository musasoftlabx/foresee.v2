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

      MONGO_URI: string;

      npm_package_name: string;
      MAX_FILE_SIZE: string;
    }
  }
}

export {};
