import { ChatGroq } from "@langchain/groq";
// import { HumanMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { config as LoadEnv } from "dotenv";
LoadEnv();

const model = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});

const messageHistories: Record<string, InMemoryChatMessageHistory> = {};

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful assistant who remembers all details the user shares with you.`,
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);

const chain = prompt.pipe(model);

const withMessageHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: async (sessionId) => {
    if (messageHistories[sessionId] === undefined) {
      messageHistories[sessionId] = new InMemoryChatMessageHistory();
    }
    return messageHistories[sessionId];
  },
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

const config = {
  configurable: {
    sessionId: "ab",
  },
};

// were tew tew tew koy ke grok etekemalehu lame show you
const main = async ({Txtprompt}:{Txtprompt:string}) => {
  const response = await withMessageHistory.stream(
    { input: Txtprompt },
    config
  );
  for await (const streams of response){
    console.log('|', streams.content)
  }
  const followmain = async () => {
    const followupResponse = await withMessageHistory.stream(
      {
        input: Txtprompt,
      },
      config
    );
    for await (const chunk of followupResponse){
      console.log(' ', chunk.content)
    }

  
  };

 await followmain();
};
export default main;