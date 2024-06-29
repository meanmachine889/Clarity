import {Pinecone} from "@pinecone-database/pinecone";

export const pinecone = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECON_API_KEY!,
});

