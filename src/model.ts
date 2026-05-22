import { ChatDeepSeek } from '@langchain/deepseek';
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";

const model = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY, // Default value.
  model: "deepseek-chat",
  temperature: 0,
  maxTokens: 500
});
// const model = new ChatOpenAI({
//   model: "deepseek-chat", // or deepseek-reasoner
//   apiKey: process.env.DEEPSEEK_API_KEY,
//   configuration: {
//     baseURL: "https://api.deepseek.com"
//   },
//   temperature: 0.1,
//   maxTokens: 1000,
// });

export default model;