import {} from "@langchain/core/prompts";
import {
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";

export default function FormatMessage(chatHistory: {
    role: string;
    content: string;
  }[] | []){
  // convert DB messages into LangChain messages
  const history = chatHistory.map((msg) => {
    if (msg.role === "user") {
      return new HumanMessage(msg.content);
    }
    return new AIMessage(msg.content);
  });
  return history;
}