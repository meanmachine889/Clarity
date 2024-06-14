import MaxwidthWrapper from "@/components/maxWidthWrapper";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ContainerScroll } from "../components/ui/container-scroll-animation";

export default function Home() {
  return (
    <>
      <div className="flex flex-col h-fit overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Chat With Your{" "}
                <span className="text-orange-400">Documents</span> <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  in Seconds.
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={`/image.png`}
            alt="hero"
            height={720}
            width={1400}
            quality={100}
            className="mx-auto bg-black rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
        <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className='relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]'
            />
          </div>
        </div>
      <MaxwidthWrapper className="mb-12 flex flex-col justify-center items-center text-center">
        <p className="max-w-prose text-lg text-zinc-300 sm:text-lg">
          Have conversations with any pdf document, Simply upload your file and
          ask questions right away
        </p>
        <Link
          href="/dashboard"
          className={buttonVariants({
            size: "lg",
            className: "mt-5",
          })}
          target="_blank"
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </MaxwidthWrapper>
      <div className="mx-auto mb-32 max-w-5xl sm:mt-56">
        <div className="mb-12 p-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-gray-200 sm:text-5xl">Start Chatting in Seconds</h2>
            <p className="mt-4 text-lg text-gray-400">
              Chatting to your pdf file has never been easier
            </p>
          </div>
        </div>
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-600 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-orange-400">
                Step 1
              </span>
              <span className="text-xl font-semibold">Sign up for an account</span>
              <span className="text-zinc-400">
                Either start out with a free plan or choose our <Link href={'/pricing'} className="text-orange-500">pro plan</Link>
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-600 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-orange-400">
                Step 2
              </span>
              <span className="text-xl font-semibold">Upload your pdf file</span>
              <span className="text-zinc-400">
                We&apos;ll process your file and make it ready for chatting with you
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-600 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-orange-400">
                Step 3
              </span>
              <span className="text-xl font-semibold">Start asking questions</span>
              <span className="text-zinc-400">
                Hooray! it&apos;s done
              </span>
            </div>
          </li>
        </ol>
        <div className='mx-auto max-w-6xl px-6 lg:px-8'>
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
              <Image
                src='/image.png'
                alt='uploading preview'
                width={1899}
                height={913}
                quality={100}
                className='rounded-lg bg-gradient-to-b from-gray-900 to-black p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
