import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { config } from "dotenv";
config();

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

const confi = {
  configurable: {
    sessionId: "ab",
  },
};

// were tew tew tew koy ke grok etekemalehu lame show you
const main = async () => {
  const response = await withMessageHistory.invoke(
    { input: "hi my name is sadam" },
    confi
  );
  response.content;
  console.log(response.content);
  const followmain = async () => {
    const followupResponse = await withMessageHistory.invoke(
      {
        input: "What's my name?",
      },
      confi
    );

    followupResponse.content;
    console.log(followupResponse.content);
  };
  followmain();
};
main();
