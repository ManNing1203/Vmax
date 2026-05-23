import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const invoiceTool = tool(
  async ({
    check,
    category,
    description,
    totalAmount,
    date,
  }) => ({
        check,
    category,
    description,
    totalAmount,
    date,
  }),
  {
    name: "invoice_record",
    description: `
      Extract and structure expense or invoice information
      from user messages, OCR text, receipts, or invoices.
    `,

    schema: z.object({
       check:z.boolean().describe(`
        Check if the text contains an invoice or expense information.
        Return true if it contains invoice or expense relevant information like totalAmount, otherwise return false.
      `),
      category: z
        .string()
        .describe(`
          Expense category.

          Examples:
          - "Starbucks coffee" -> Food
          - "Grab ride" -> Transport
          - "Adobe subscription" -> Software
          - "Laptop purchase" -> Hardware
         Leave undefined if user does not mention.

        `).nullable(),
      description: z
        .string()
        .describe(`
          Short expense description.
          Examples:
          - "Starbucks coffee"
          - "Office laptop"
          - "Monthly Adobe subscription"
        Leave undefined if user does not mention.

        `).nullable(),

      totalAmount: z
        .number()
        .describe(`
          Total expense amount as number only.

          Examples:
          - "RM25.50" -> 25.5
          - "$100" -> 100
        Leave undefined if user does not mention.

        `).nullable(),

      date: z
        .string()
        .describe(`
          Expense or invoice date in ISO format.

          Format:
          YYYY-MM-DD
          Examples:
          - "20 May 2026" -> 2026-05-20
          - "yesterday" -> convert to actual date
         Leave undefined if user does not mention.
        `).nullable(),
      
    }),
  }
);
export default invoiceTool;