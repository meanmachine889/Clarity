import { createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { Old_Standard_TT } from "next/font/google";

type ChatContextType = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<ChatContextType>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = trpc.useContext();

  const toast = useToast();

  const backUpMessage = useRef<string>("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },

    onMutate: async ({ message }) => {
      backUpMessage.current = message;
      setMessage("");

      await utils.getFileMessages.cancel();

      const previousMessages = utils.getFileMessages.getInfiniteData();

      utils.getFileMessages.setInfiniteData(
        { fileId, limit: 10 },
        (oldData) => {
          if (!oldData) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let newPages = [...oldData.pages];

          let latestPage = newPages[0]!;

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },

    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        alert("No response from the server");
      }
    
      const reader = stream?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accResponse = "";
    
      while (!done) {
        const { value, done: isDone } = await reader!.read();
    
        if (value) {
          accResponse += decoder.decode(value, { stream: !isDone });
        }
    
        done = isDone;
      }
    
      // Final update after the complete response is received
      utils.getFileMessages.setInfiniteData(
        { fileId, limit: 10 },
        (oldData) => {
          if (!oldData) {
            return { pages: [], pageParams: [] };
          }
    
          let isAiResponseCreated = oldData.pages.some((page) =>
            page.messages.some((message) => message.id === "ai-response")
          );
    
          let updatedPages = oldData.pages.map((page) => {
            if (page === oldData.pages[0]) {
              let updatedMessages;
    
              if (!isAiResponseCreated) {
                updatedMessages = [
                  {
                    createdAt: new Date().toISOString(),
                    id: "ai-response",
                    isUserMessage: false,
                    text: accResponse,
                  },
                  ...page.messages,
                ];
              } else {
                updatedMessages = page.messages.map((message) => {
                  if (message.id === "ai-response") {
                    return {
                      ...message,
                      text: accResponse,
                    };
                  }
                  return message;
                });
              }
    
              return {
                ...page,
                messages: updatedMessages,
              };
            }
    
            return page;
          });
    
          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },
    
    

    onError: (_, __, context) => {
      setMessage(backUpMessage.current);
      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [] }
      );
    },

    onSettled: async () => {
      setIsLoading(false);

      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const addMessage = () => sendMessage({ message });
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(event.target.value);

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
