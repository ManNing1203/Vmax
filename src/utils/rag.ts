// import OpenAI from 'openai';
// import { StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers';
// import {} from "@langchain/core/prompts";
// import { success, z, ZodAny } from "zod";
// import { ChatPromptTemplate, MessagesPlaceholder, } from '@langchain/core/prompts';
// import { ChatDeepSeek } from '@langchain/deepseek';
// import {
//   HumanMessage,
//   AIMessage,
// } from "@langchain/core/messages";
// import { StateGraph, START, END, Annotation } from "@langchain/langgraph";




// // async function detectEdge(state:GraphState) {
// //     console.log(state.node);
// //     return {
// //         node:"total"
// //     };
// // }
// // async function total(state:GraphState) {
// //     console.log(state.node);
// //     return{
// //         node:"jojo"
// //     }
// // }
// // async function end(state:GraphState) {
// //     console.log(state.node);
// //       return{
// //         node:"end"
// //     }
// // }
//  export const GraphState = Annotation.Root({
//   chatHistory: Annotation< {
//     role: string;
//     content: string;
//   }[]>(),
//   case: Annotation<string>(),
//   question: Annotation<string>(),
//   result: Annotation<any>(),
// });
// export default async function rag(){ 
//      const graph =  new StateGraph(GraphState)
//      .addNode("MainCase",mainCase)
//      .addEdge(START,"MainCase")
//      .addConditionalEdges(
//         "MainCase",
//         (state)=>state.case
//      )
      
//   const app = graph.compile();
//   const result = await app.invoke({
//     chatHistory: [
//       {  
//           role: "user",
//         content: "i am sor victor"
//       }
//     ],
//     question:'month what is my Highest Saving '
//   });
//   return (result);
  
// }

