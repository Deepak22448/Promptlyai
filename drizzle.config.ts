import { type Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./lib/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  entities: {
    roles: {
      provider: "neon",
    },
  },
} satisfies Config;
