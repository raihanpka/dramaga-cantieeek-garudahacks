import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const createMemory = () => {
  return new Memory({
    storage: new LibSQLStore({
      url: process.env.TURSO_DB_URL || "",
    }),
    options: {
      threads: {
        generateTitle: true,
      },
      lastMessages: 10,
    }
  });
};