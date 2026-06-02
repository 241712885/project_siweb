import { neon, neonConfig } from "@neondatabase/serverless";

neonConfig.fetchEndpoint = (host) => {
  return `https://${host}/sql`;
};

export const sql = neon(process.env.NEON_NEW_DATABASE_URL || process.env.DATABASE_URL!);