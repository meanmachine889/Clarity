"use client";

import React, { useState, useContext } from "react";
import UploadButton from "./uploadButton";
import { trpc } from "@/app/_trpc/client";
import {
  BookOpen,
  Coffee,
  Ghost,
  GhostIcon,
  Loader2,
  MessageSquare,
  Plus,
  Trash,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./ui/button";

const Dashboard = () => {
  const [deleteFiles, setdeleteFiles] = useState<string | null>();

  const utils = trpc.useContext();

  const { data: files, isLoading, error } = trpc.getUserFiles.useQuery();

  console.log("Files:", files);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setdeleteFiles(id);
    },
    onSettled() {
      setdeleteFiles(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10 px-2">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-800 sm:flex-row pb-5 sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-200">files</h1>
        <UploadButton />
      </div>
      <div>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center mt-9">
            <Loader2 className="my-2 min-h-10 min-w-10 animate-spin" />
          </div>
        ) : files && files.length ? (
          <ul className="mt-8 grid-cols-1 grid gap-6 divide-y divide-gray-900 md:grid-cols-2 lg:grid-cols-3">
            {files
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((file) => (
                <li
                  key={file.id}
                  className="col-span-1 divide-y divide-black rounded-lg bg-zinc-900 shadow mb-4 transition hover:shadow-lg"
                >
                  <Link
                    href={`/dashboard/${file.id}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-orange-400">
                        {deleteFiles === file.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Coffee className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate font-medium text-lg">
                            {file.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {format(new Date(file.createdAt), "MMM yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      mocked
                    </div>
                    <Button
                      onClick={() => deleteFile({ id: file.id })}
                      size={"sm"}
                      className="w-full bg-gray-800 group"
                    >
                      <TrashIcon className="h-4 w-4 text-red-400 group-hover:text-white hover:text-white" />
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-orange-400" />
            <h3 className="font-semibold text-xl">looks quite empty</h3>
            <p>let&apos;s upload your first pdf</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
