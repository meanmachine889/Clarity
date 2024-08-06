"use client";

import MaxwidthWrapper from "@/components/maxWidthWrapper";
import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";
import { useScroll, useTransform } from "framer-motion";
import { ArrowRight, Linkedin, LinkedinIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { HeroHighlightDemo } from "@/components/HighlightText";
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/server'

export default function Home() {
  return (
    <div className="dark:bg-black flex flex-col bg-white  dark:bg-dot-white/[0.1] bg-dot-black/[0.2] scrollbar-w-2 scrollbar-track-orange-lighter scrollbar-thumb-orange scrollbar-thumb-rounded">
      <div className="flex flex-col justify-center items-center overflow-hidden">
        <HeroHighlightDemo />
      </div>
      {/* <MaxwidthWrapper className="flex -mt-7 cursor-pointer mb-9 flex-col justify-center items-center text-center">
      <LoginLink
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          sign in
        </LoginLink>
      </MaxwidthWrapper> */}
      <div className="mx-auto mb-32 max-w-5xl">
        <div className="mt-5 p-3 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-9 font-bold text-2xl text-gray-200 sm:text-5xl">
              a few steps and u are ready to go!
            </h2>
          </div>
        </div>
        <ol className="my-4 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-600 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-orange-400">
                step 1
              </span>
              <span className="text-xl font-semibold">
                sign up for an account
              </span>
              <span className="text-zinc-400">sign up using you email</span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-600 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-orange-400">
                step 2
              </span>
              <span className="text-xl font-semibold">
                upload your pdf file
              </span>
              <span className="text-zinc-400">
                we&apos;ll process your file and make it ready for chatting with
                you
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-600 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-orange-400">
                step 3
              </span>
              <span className="text-xl font-semibold">
                start asking questions
              </span>
              <span className="text-zinc-400">Hooray! it&apos;s done</span>
            </div>
          </li>
        </ol>
        <div className="mx-auto max-w-6xl px-6 lg:px-8 ">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-orange-900 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/image copy.png"
                alt="uploading preview"
                width={1919}
                height={905}
                quality={100}
                className="rounded-lg bg-gradient-to-b from-gray-900 to-black p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>

          <div className="flex justify-center items-center mt-9">
            <p className="font-bold text-2xl text-gray-200 sm:text-5xl">
              and that&apos;s it! enjoy!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
