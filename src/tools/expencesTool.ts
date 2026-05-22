import { z } from "zod";
import { tool } from "langchain/tools";

const ExpenseTool = tool(
  ({ groupBy, timeRange, caseType }) =>
    `Expense filter -> case: ${caseType}, groupBy: ${groupBy}, from: ${timeRange?.from}`,
  {
    name: "expense",
    description: "Get expense analytics",
    schema: z.object({
      caseType: z
        .enum(["highest", "lowest", "average"])
        .optional()
        .describe(`
          The type of expense analysis.
          Examples:
          - "highest expense" -> highest
          - "lowest expense month" -> lowest
          - "average expense this year" -> average
        `),

      groupBy: z
        .enum(["day", "week", "month", "year"])
        .optional()
        .describe(`
          The time grouping level for the result.

          Examples:
          - "expense day" -> day
          - "expense month" -> month
          - "yearly expense" -> year

          Leave undefined if user does not mention grouping.
        `),

      timeRange: z
        .object({
          from: z
            .string()
            .optional()
            .describe(`
              Start date in ISO format if explicitly mentioned by user.
              Example: 2025-01-01
            `),

          to: z
            .string()
            .optional()
            .describe(`
              End date in ISO format if explicitly mentioned by user.
              Example: 2025-12-31
            `)     
    }),
  })}
)

export default ExpenseTool;