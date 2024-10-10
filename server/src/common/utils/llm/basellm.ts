import { ChatOpenAI, OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { config } from "dotenv";
// import E
config();

export const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});
export const GptEmbedding = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
});
export const HugEmbedding = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY,
});
// export default llm GptEmbedding HugEmbedding;
