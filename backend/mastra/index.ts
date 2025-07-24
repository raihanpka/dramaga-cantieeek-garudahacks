import { Mastra } from "@mastra/core";
import { scanAgent } from "./agents/scanAgent";
import { culturalChatbot } from "./agents/kalaChatbot";

export const mastra = new Mastra({
  agents: { scanAgent, culturalChatbot },
});