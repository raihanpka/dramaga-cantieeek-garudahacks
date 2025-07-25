import { Mastra } from "@mastra/core";
import { scanAgent } from "./agents/scanAgent.js";
import { culturalChatbot } from "./agents/kalaChatbot.js";

export const mastra = new Mastra({
  agents: { scanAgent, culturalChatbot },
});