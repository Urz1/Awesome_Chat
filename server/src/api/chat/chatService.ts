import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import {
  ChatPromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { llm} from "@/common/utils/llm/basellm";
import documentChain from "@/common/utils/document/DocumentChain";
import { pull } from "langchain/hub";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const loader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/"
);

const ChatService = async (question: string) => {

    const retriever = await documentChain();

    const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");

    const ragChain = await createStuffDocumentsChain({
      llm,
      prompt,
      outputParser: new StringOutputParser(),
    });

    return ragChain.stream({
      context: retriever.invoke(question),
      question: question,
    });

};

export default ChatService;

// console.log(chunk)
// if (gathered == undefined){
//   gathered = chunk
// }
// else {
//   gathered = concat(gathered,chunk)
// }

// const httpResponse = new Response(aiMsg, {
//   headers: {
//     "Content-Type": "text/plain; charset=utf-8",
//   },
// });
// return httpResponse;

// let gathered: AIMessageChunk | undefined = undefined;

// for await (const chunk of aiMsg) {
//   console.log(chunk)
//   if (gathered == undefined){
//     gathered = chunk;
//   }
//   else {
//     gathered = concat(gathered,chunk)
//   }
// }

// const
// console.log(gathered?.content);
// console.log("i have send ")
// console.log(aiMsg.content);

// chat_history = chat_history.concat(aiMsg);

// return aiMsg.content
// // return aiMsg
// const secondQuestion = "What are common ways of doing it?";
// console.log(
//   (await ragChain.invoke({ question: secondQuestion, chat_history })).content
// );
