import 'reflect-metadata';
import { PostgresDatabase } from './data/postgres/postgres-database';
import { envs } from './config';
import { Server } from './presentation/server';
import { AppRoutes } from './presentation/routes';

async function main() {
  const postgres = new PostgresDatabase({
    username: envs.DATABASE_USERNAME,
    password: envs.DATABASE_PASSWORD,
    host: envs.DATABASE_HOST,
    database: envs.DATABASE_NAME,
    port: envs.DATABASE_PORT,
  });

  await postgres.connect();

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  await server.start();
}

main();
