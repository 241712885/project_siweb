import { neon, neonConfig } from "@neondatabase/serverless";

neonConfig.fetchEndpoint = (host) => {
  return `https://${host}/sql`;
};

export const sql = neon(process.env.DATABASE_URL!);