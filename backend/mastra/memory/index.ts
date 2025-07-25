import { Memory } from "@mastra/memory";
import { LibSQLVector } from "@mastra/libsql";

export const createMemory = () => {
  return new Memory({
    vector: new LibSQLVector({
      connectionUrl: process.env.TURSO_DB_URL || "",
      authToken: process.env.TURSO_AUTH_TOKEN || ""
    }),
    options: {
      threads: {
        generateTitle: true,
      },
      lastMessages: 10,
    }
  });
};