import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAI } from "@google/generative-ai";

const f = createUploadthing();

const PINECONE_API_URL = `https://clarity-vpg0435.svc.aped-4627-b74a.pinecone.io`;

export const ourFileRouter = {
  imageUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user || !user.id) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdfile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await fetch(`https://utfs.io/f/${file.key}`);
        const blob = await response.blob();
        const loader = new PDFLoader(blob);
        const pageLevelDocs = await loader.load();
        
        // Log loaded PDF content for verification
        console.log("Loaded PDF content: ", pageLevelDocs);

        // Vectorizing PDF with Gemini
        const genAI = new GoogleGenerativeAI(
          process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!
        );
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        const embeddingsPromises = pageLevelDocs.map(async (doc, index) => {
          const result = await model.embedContent(doc.pageContent);
          return {
            id: `${createdfile.id}_page_${index + 1}`,
            values: result.embedding.values,
            metadata: {
              page: index + 1,
              fileId: createdfile.id,
              pageContent: doc.pageContent, // Add page content to metadata
            },
          };
        });
        const pineconeEmbeddings = await Promise.all(embeddingsPromises);

        console.log("PINECONE EMBEDDINGS ARE : ", pineconeEmbeddings);

        // Upsert embeddings to Pinecone using fetch
        const upsertResponse = await fetch(
          `${PINECONE_API_URL}/vectors/upsert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Api-Key": process.env.NEXT_PUBLIC_PINECON_API_KEY!,
            },
            body: JSON.stringify({
              vectors: pineconeEmbeddings,
              namespace: createdfile.id,
            }),
          }
        );

        if (!upsertResponse.ok) {
          const errorText = await upsertResponse.text();
          console.error("Failed to upsert embeddings to Pinecone:", errorText);
          throw new Error("Failed to upsert embeddings to Pinecone");
        }

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdfile.id,
          },
        });
      } catch (error) {
        console.log("ERROR IS : ", error);
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdfile.id,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
