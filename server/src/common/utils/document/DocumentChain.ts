import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { GptEmbedding, HugEmbedding } from "../llm/basellm";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import path from "path";


const Pdf = 'Document 1 (4)';


const documentChain =  async () => { 
      const pdfPath = path.resolve(
        __dirname,
        `${Pdf}.pdf`,
      );
    const loader = new PDFLoader(pdfPath, { splitPages: false });
    const docs = await loader.load();
    
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splits = await textSplitter.splitDocuments(docs);
      const vectorStore = new Chroma(GptEmbedding, {
        collectionName: "a-test-collection",
        url: "http://localhost:8000", 
        collectionMetadata: {
          "hnsw:space": "cosine",
        }, 
      });
      await vectorStore.addDocuments(splits)
      const retriever =  vectorStore.asRetriever();
      return retriever
      
}
export default documentChain
