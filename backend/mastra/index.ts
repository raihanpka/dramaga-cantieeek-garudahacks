import { Mastra } from "@mastra/core";
import { scanAgent } from "./agents/scanAgent";

export const mastra = new Mastra({
  agents: { scanAgent },
});