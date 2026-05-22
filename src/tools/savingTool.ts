import { ChatPromptTemplate, MessagesPlaceholder, } from '@langchain/core/prompts';
import OpenAI from 'openai';
import { StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers';
import {} from "@langchain/core/prompts";
import { z, ZodAny } from "zod";
import {
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";
import FormatMessage from '../utils/FormatMessage';
import model from '../model';
import { createAgent, tool, Tool } from 'langchain';



// export async function HighestSaving(
//   node:typeof GraphState.State
// ) {
// const history = node.chatHistory;
// const question = node.question

// const schema = z.object({
//   intent:z.literal('TotalSaving'),
//   groupBy: z.enum([
//     "day",
//     "week",
//     "month",
//     "year",
//   ]).optional().describe(`
//     The time grouping level for the result.

//     Examples:
//     - "highest saving day" -> day
//     - "best saving month" -> month
//     - "yearly comparison" -> year

//     Leave undefined if user does not mention grouping.
//   `),

//   timeRange: z.object({
//     from: z.string().optional().describe(`
//       Start date in ISO format if explicitly mentioned by user.
//       Example: 2025-01-01
//     `),

//     to: z.string().optional().describe(`
//       End date in ISO format if explicitly mentioned by user.
//       Example: 2025-12-31
//     `),

//     preset: z.enum([
//       "today",
//       "this_week",
//       "this_month",
//       "this_year",
//       "all_time",
//     ]).optional().describe(`
//       Predefined date range extracted from natural language.
//       Examples:
//       - "today" -> today
//       - "this month" -> this_month
//       - "this year" -> this_year
//       - "overall" -> all_time
//     `),
//   }).optional().describe(`
//     The requested date range or period.
//   `),

//   limit: z.number().optional().describe(`
//     Number of records to return.

//     Examples:
//     - "top 5 saving days" -> 5
//     - "show 3 highest expenses" -> 3

//     Leave undefined if user does not specify a limit.
//   `),
// });

// const prompt = ChatPromptTemplate.fromMessages([
//     [
//     "system",
//       `
//     You are a classifier for a finance savings app.
//     You MUST respond ONLY in valid JSON.
//     No explanation. No markdown. No extra text.
//     AND You MUST follow this format:
//     {format_instructions}
//     `,
//     ],
//     // history placeholder
//     new MessagesPlaceholder("history"),
//     // latest question
//     ["human", "{question}"],
// ]);
// // const parse = new StringOutputParser();
// const parser = StructuredOutputParser.fromZodSchema(schema);
// // const modelWithSchema = model.withStructuredOutput(schema);
// const chain = prompt.pipe(model).pipe(parser);

// const res = await chain.invoke({
//   format_instructions:parser.getFormatInstructions(),
//   history,
//   schema,
//   question
// })
// return {
//   result:`highestSaving ${res.groupBy ?? 'null'}`
// };
// }



const SavingTool = tool(
  ({ groupBy, timeRange, caseType },config) =>
    `Hi,${config.context.userName} your id is ${config.context.userId} Saving filter -> case: ${caseType}, groupBy: ${groupBy}, from: ${timeRange?.from}`,
  {
    name: "saving",
    description: "Get saving analytics",

    schema: z.object({
      caseType: z
        .enum(["highest", "lowest", "average"])
        .optional()
        .describe(`
          The type of saving analysis.

          Examples:
          - "highest saving" -> highest
          - "lowest saving month" -> lowest
          - "average saving this year" -> average
        `),

      groupBy: z
        .enum(["day", "week", "month", "year"])
        .optional()
        .describe(`
          The time grouping level for the result.

          Examples:
          - "saving day" -> day
          - "saving month" -> month
          - "yearly saving" -> year

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
        })
        .optional()
        .describe(`
          The requested date range or period.
        `),
    }),
  }
);

export default SavingTool;


// const schema = z.object({
//   intent:z.literal('TotalSaving'),
//   groupBy: z.enum([
//     "day",
//     "week",
//     "month",
//     "year",
//   ]).optional().describe(`
//     The time grouping level for the result.

//     Examples:
//     - "highest saving day" -> day
//     - "best saving month" -> month
//     - "yearly comparison" -> year

//     Leave undefined if user does not mention grouping.
//   `),

//   timeRange: z.object({
//     from: z.string().optional().describe(`
//       Start date in ISO format if explicitly mentioned by user.
//       Example: 2025-01-01
//     `),

//     to: z.string().optional().describe(`
//       End date in ISO format if explicitly mentioned by user.
//       Example: 2025-12-31
//     `),

//     preset: z.enum([
//       "today",
//       "this_week",
//       "this_month",
//       "this_year",
//       "all_time",
//     ]).optional().describe(`
//       Predefined date range extracted from natural language.
//       Examples:
//       - "today" -> today
//       - "this month" -> this_month
//       - "this year" -> this_year
//       - "overall" -> all_time
//     `),
//   }).optional().describe(`
//     The requested date range or period.
//   `),

//   limit: z.number().optional().describe(`
//     Number of records to return.

//     Examples:
//     - "top 5 saving days" -> 5
//     - "show 3 highest expenses" -> 3

//     Leave undefined if user does not specify a limit.
//   `),
// });

// const prompt = ChatPromptTemplate.fromMessages([
//     [
//     "system",
//       `
//     You are a classifier for a finance savings app.
//     You MUST respond ONLY in valid JSON.
//     No explanation. No markdown. No extra text.
//     AND You MUST follow this format:
//     {format_instructions}
//     `,
//     ],
//     // history placeholder
//     new MessagesPlaceholder("history"),
//     // latest question
//     ["human", "{question}"],
// ]);
// // const parse = new StringOutputParser();
// const parser = StructuredOutputParser.fromZodSchema(schema);
// // const modelWithSchema = model.withStructuredOutput(schema);
// const chain = prompt.pipe(model).pipe(parser);

// const res = await chain.invoke({
//   format_instructions:parser.getFormatInstructions(),
//   history,
//   schema,
//   question
// })
// return {
//   result:`highestSaving ${res.groupBy ?? 'null'}`
// };
// }