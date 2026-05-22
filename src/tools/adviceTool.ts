import { tool } from "langchain";
import * as z from "zod";

export const adviceTool = tool(
  async (_, config) => {
    const context = config.context;

    return `
      Based on the financial data,
      reduce unnecessary spending
      and increase weekly savings.
    `;
  },
  {
    name: "financial_advice",
    description:
      "Give financial advice based on user financial data and conversation context.",
    schema: z.object({}),
  }
);