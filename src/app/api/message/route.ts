import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { sendMessageValidator } from "../../../lib/validators/sendMessageValidator";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const userId = user?.id;

    if (!user || !user.id) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { fileId, message } = sendMessageValidator.parse(body);

    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId,
        },
    });

    if (!file) {
        return new Response('File not found', { status: 404 });
    }

    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId,
            fileId,
        },
    });

    // 1: Vectorize the message using Gemini API
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const embeddingResult = await embeddingModel.embedContent(message);
    const messageEmbedding = embeddingResult.embedding.values;

    // 2: Retrieve similar embeddings from Pinecone
    const pineconeResponse = await fetch(`https://clarity-vpg0435.svc.aped-4627-b74a.pinecone.io/query`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            "Api-Key": process.env.NEXT_PUBLIC_PINECON_API_KEY!,
        }),
        body: JSON.stringify({
            vector: messageEmbedding,
            topK: 5,
            includeMetadata: true,
            namespace: file.id,
        }),
    });

    if (!pineconeResponse.ok) {
        const errorText = await pineconeResponse.text();
        return new Response(`Failed to query Pinecone: ${errorText}`, { status: 500 });
    }

    const pineconeResults = await pineconeResponse.json();
    const similarPages = pineconeResults.matches.map((match: any) => match.metadata);

    // 3: Load previous chats
    const prevMessages = await db.message.findMany({
        where: {
            fileId,
        },
        orderBy: {
            createdAt: 'asc',
        },
        take: 6,
    });

    const formattedPrevMessages = prevMessages.map(msg => ({
        role: msg.isUserMessage ? 'user' : 'model',
        content: msg.text,
    }));

    // 4: Generate AI response using streaming
    const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Ensure the first message in history is from the user
    const history = [
        {
            role: "user",
            parts: [{ text: message }],
        },
        ...formattedPrevMessages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
        })),
        {
            role: "model",
            parts: [{ text: 'Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.' }],
        },
    ];

    const chat = chatModel.startChat({
        history,
        generationConfig: {
            maxOutputTokens: 100,
        },
    });

    const result = await chat.sendMessageStream(`Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n----------------\n\nPREVIOUS CONVERSATION:\n${formattedPrevMessages.map((msg: any) => (msg.role === 'user' ? `User: ${msg.content}\n` : `Assistant: ${msg.content}\n`)).join('')}\n----------------\n\nCONTEXT:\n${similarPages.map((page: any) => page.pageContent).join('\n\n')}\n\nUSER INPUT: ${message}`);

    // 5: Stream the AI response
    let responseText = '';
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        responseText += chunkText;
    }

    await db.message.create({
        data: {
            text: responseText,
            isUserMessage: false,
            fileId,
            userId,
        },
    });

    return new Response(responseText, { status: 200 });
};
