"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Divide,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PdfFullScreen from "./PdfFullScreen";

import SimpleBar from "simplebar-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

type Props = {
  url: string;
};

const PdfRenderer = ({ url }: Props) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurr] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderScale, setRender] = useState<number | null>(null)
  
  const isLoading = renderScale !== scale

  const pageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TPageValidator = z.infer<typeof pageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(pageValidator),
  });

  console.log("URL IS ", url);

  const handlePageSubmit = ({ page }: TPageValidator) => {
    const pageNumber = Number(page);
    setCurr(pageNumber);
    setValue("page", String(pageNumber));
  };

  return (
    <div className="w-full rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b bg-zinc-900 rounded-md border-black flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currPage <= 1}
            onClick={() => {
              setCurr((prev) => (prev - 1 >= 1 ? prev - 1 : 1));
              setValue('page', String(currPage-1));
            }}
            aria-label="previous page"
            variant={"ghost"}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
              className={cn(
                "w-12 h-8 border-none focus-visible:border-0 outline-none",
                errors.page && "focus-visible:ring-red-500"
              )}
            />
            <p className="text-gray-400 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>
          <Button
            disabled={numPages === undefined || currPage === numPages}
            onClick={() => {
              setCurr((prev) => (prev + 1 > numPages! ? numPages! : prev + 1));
              setValue('page', String(currPage+1));
            }}
            aria-label="next page"
            variant={"ghost"}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" variant={"ghost"} aria-label="zoom">
                <Search className="h-4 w-4" />
                {scale * 100}%
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setRotation((prev) => prev+90)} aria-label="rotate 90 degrees" variant={"ghost"}>
            <RotateCw className="h-4 w-4"/>
          </Button>

          <PdfFullScreen fileUrl={`https://utfs.io/f/${url}`}/>
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document 
              loading={
                <div className="flex justify-center">
                  <Loader2 className="animate-spin my-24 h-6 w-6" />
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={`https://utfs.io/f/${url}`}
              onLoadError={() => {
                toast({
                  title: "Error loading pdf",
                  description: "Please try again",
                  variant: "destructive",
                });
              }}
              className="max-h-full"
            >
              {isLoading && renderScale ? <Page
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                key={"@" + renderScale}
              /> : null}
              <Page
                className={cn(isLoading ? "hidden": "")}
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 my-24 animate-spin"/>
                  </div>
                }
                onRenderSuccess={() => setRender(scale)}
              /> 
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
