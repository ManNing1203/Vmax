// import { ChatPromptTemplate, MessagesPlaceholder, } from '@langchain/core/prompts';
// import { ChatDeepSeek } from '@langchain/deepseek';
// import OpenAI from 'openai';
// import { StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers';
// import {} from "@langchain/core/prompts";
// import { z, ZodAny } from "zod";
// import {
//   HumanMessage,
//   AIMessage,
// } from "@langchain/core/messages";
// import model from '../model';
// import FormatMessage from './FormatMessage';
// import { GraphState } from './rag';



// export async function MainCase
// (
//  node:typeof GraphState.State
// ) {
// const history = FormatMessage(node.chatHistory);
// const question = node.question; 

// const schema = z.object({
//   intent: z.enum([
//     "TotalSaving",
//     "HighestSaving",
//     // "LOWEST_EXPENSES",
//     // "TOTAL_EXPENSES",
//     // "TREND",
//     // "ANOMALY",
//     // "PREDICTION",
//     "Unknown",
//   ]).describe(
//     `
//     Main business intent detected from the user question.
//     Examples:
//     - "highest expense this month" -> HighestSaving
//     - "how much did I save?" -> TotalSaving
//     - unclear or unrelated questions -> Unknown
//     - "lowest spending category" -> LOWEST_EXPENSES
//     - "spending trend recently" -> TREND
//     - "detect unusual transaction" -> ANOMALY
//     - "future saving prediction" -> PREDICTION
//     `),

// });

// const prompt = ChatPromptTemplate.fromMessages([
//     [
//     "system",
//       `
//         You are a classifier for a finance savings app.
//         You MUST follow this format:
//         {format_instructions}
//       `,
//     ],
//     // history placeholder
//     new MessagesPlaceholder("history"),
// ]);


// // const parse = new StringOutputParser();
// const parser = StructuredOutputParser.fromZodSchema(schema);
// const chain = prompt.pipe(model).pipe(parser);

// const res = await chain.invoke({
//   history,
//   format_instructions:parser.getFormatInstructions()
// })
// return {
//   case:res.intent
// };
// }