"use client";

import React from "react";
import Messages from "./messages";
import ChatInput from "./chatInput";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import { ChatContextProvider } from "./chatContext";

interface Props {
  fileId: string;
}

const Chatwrapper = ({ fileId }: Props) => {

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative min-h-full bg-black flex divide-y divide-zinc-700 flex-col justify-between gap-2">
        <div className="flex-1 justify-between flex flex-col mb-28 scrollbar-w-2 scrollbar-track-orange scrollbar-thumb-orange scrollbar-thumb-rounded">
          <Messages fileId={fileId}/>
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default Chatwrapper;
