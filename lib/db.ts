import "server-only";
import postgres from "postgres";
import { getJsonDb } from "./json-db";

declare global {
  // eslint-disable-next-line no-var
  var __dpsSql: postgres.Sql | undefined;
}

/** In local mode without DATABASE_URL, local JSON DB is active. In prod, Neon Postgres is used. */
export const hasDatabase = () => true;

/** Returns shared Neon connection pool if DATABASE_URL is set, or local JSON database otherwise. */
export function db(): postgres.Sql {
  const url = process.env.DATABASE_URL;
  if (url) {
    if (!globalThis.__dpsSql) {
      globalThis.__dpsSql = postgres(url, {
        max: 5,
        idle_timeout: 20,
        connect_timeout: 15,
        prepare: false,
        types: { numeric: { to: 1700, from: [1700], serialize: (x: unknown) => String(x), parse: (x: string) => Number(x) } },
      });
    }
    return globalThis.__dpsSql;
  }
  return getJsonDb() as unknown as postgres.Sql;
}

