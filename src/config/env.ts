import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  NODE_ENV: get('NODE_ENV').required().asString(),
  DATABASE_PASSWORD: get('DATABASE_PASSWORD').required().asString(),
  DATABASE_USERNAME: get('DATABASE_USERNAME').required().asString(),
  DATABASE_NAME: get('DATABASE_NAME').required().asString(),
  DATABASE_PORT: get('DATABASE_PORT').required().asPortNumber(),
  DATABASE_HOST: get('DATABASE_HOST').required().asString(),
  JWT_KEY: get('JWT_KEY').required().asString(),
  JWT_EXPIRE_IN: get('JWT_EXPIRE_IN').required().asString(),

  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
  SEND_MAIL: get('SEND_MAIL').required().asBool(),
};
