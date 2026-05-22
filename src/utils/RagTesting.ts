import OpenAI from 'openai';
import { StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers';
import {} from "@langchain/core/prompts";
import { success, z, ZodAny } from "zod";
import { ChatPromptTemplate, MessagesPlaceholder, } from '@langchain/core/prompts';
import { ChatDeepSeek } from '@langchain/deepseek';

import {
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { createAgent, tool } from 'langchain';
import model from '../model';
import SavingTool from '../tools/savingTool';


const GraphState = Annotation.Root({
  messages: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
  default: () => [],
  }),
  success: Annotation<boolean>({
    reducer: (_, y) =>y,
    default: () => false,
  }),
});

async function greetBackNode(state:any){
  console.log(state.messages);
  return {
    messages:["hi"]
  }
}
async function greetNode(state:any){
  console.log(state.messages);
  return {
    messages:["hi jojo"],
    success:true
  }
}

async function fkOffNode(state:any){
  console.log(state.messages);
  return {
    messages:["fkOff"]

  }
}
export async function RagTesting(){
 const graph =  new StateGraph(GraphState)
 .addNode( 'greet',greetNode)
 .addNode('greetBack',greetBackNode)
 .addNode('fkOff',fkOffNode)
 .addEdge(START,"greet")
 .addConditionalEdges("greet",(state:any)=>{
    if(state.success){
      return 'greetBack';
    }
    return 'fkOff'
 })
  .addEdge("greetBack", END)
    .addEdge("fkOff", END);
  const app = graph.compile();
  const result = await app.invoke({
    messages: [],
    success: false,
  });
  console.log(result);
}
///testing 2
const weatherTool = tool(

  async ({ city },config) => {
    return `Weather in ${city} is sunny`;
  },
  {
    name: "weather",
    description: "Get weather by city",
    schema: z.object({
      city: z.string(),
    }),
  }
);


///testing 2

const contextSchema = z.object({
  userName: z.string(),
  userId: z.string(),
});

export async function RagTesting2(){
 const agent = createAgent(
  {
    model,
    tools:[SavingTool],
    contextSchema
  }
 )
 
const result = await agent.invoke(
  {
    messages: [{ role: "user", content: "What is my name?" }],
  },
  {
    context: { userId: "John Smith",userName :"jojo" }
  },
);

console.log(result);
return result;
}







