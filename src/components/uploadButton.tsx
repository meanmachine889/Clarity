"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from './ui/button';

import DropZone from "react-dropzone";
import { File, GhostIcon, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { useUploadThing } from '@/lib/uploadthing';
import { useToast } from './ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';

const UploadDropZone = () =>{

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [uProgress, setProgress] = useState<number>(0);
    const {toast} = useToast()

    const {startUpload} = useUploadThing("imageUploader")

    const {mutate: startPoling} = trpc.getFile.useMutation({
        onSuccess: (file) => {
            router.push(`/dashboard/${file.id}`)
        },
        retry: true,
        retryDelay: 500
    })

    const startProgress = () => {
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if(prev >= 95){
                    clearInterval(interval)
                    return prev
                }

                return prev+5;
            })
        }, 500)

        return interval
    }

    return <DropZone multiple={false} onDrop={async (acceptedFile) => {
        setLoading(true)

        const progressInterval = startProgress()

        const res = await startUpload(acceptedFile);

        if(!res) {
            return toast({
                title: 'Something went wrong',
                description: 'Please try again later',
                variant: 'destructive'
            })
        }

        const [fileResponse] = res;

        const key = fileResponse?.key;

        if(!key){
            return toast({
                title: 'Something went wrong',
                description: 'Please try again later',
                variant: 'destructive'
            })
        }



        clearInterval(progressInterval);
        setProgress(100);

        startPoling({key});
    }}>
        {({getRootProps, getInputProps, acceptedFiles}) => (
            <div {...getRootProps()} className='border h-64 m-4 border-dashed border-gray-500 rounded-lg'>
                <div className='flex items-center justify-center h-full w-full'>
                    <label htmlFor="dropzone-file" className='flex flex-col items-center justify-center h-full w-full rounded-lg cursor-pointer hover:bg-gray-800'>
                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                            <GhostIcon className='h-6 w-6 text-orange-400 animate-bounce'/>
                            <p className='text-sm mb-2 mt-2'>
                                <span className='font-semibold'>
                                    click to upload{' '}
                                </span>
                                or drag and drop
                            </p>
                            <p className='text-xs text-slate-400'>PDF (up to 4mb)</p>
                        </div>
                        {acceptedFiles && acceptedFiles[0] ? (
                            <div className='max-w-xs flex items-center bg-gray-900 rounded-md overflow-hidden outline-[1px] shadow-xl outline-gray-400 divide-x divide-gray-700'>
                                <div className='px-3 py-2 h-full bg-gray-900 grid place-items-center'>
                                    <File className='h-4 w-4 text-orange-400'/>
                                </div>
                                <div className="px-3 py-2 h-full text-sm truncate">
                                    {acceptedFiles[0].name}
                                </div>
                            </div>
                        ): null}

                        {loading ? (
                            <div className='w-full mt-4 max-w-xs mx-auto'>
                                <Progress indicatorColor={uProgress === 100 ? 'bg-green-400': ''} value={uProgress} className='h-1 w-full'/>
                                {uProgress === 100 ? (
                                    <div className='flex gap-1 items-center justify-center text-sm text-center pt-2'>
                                        <Loader2 className='h-3 w-3 animate-spin'/>
                                        redirecting...
                                    </div>
                                ): null}
                            </div>
                            
                        ) : null}
                        <input {...getInputProps()} type="file" id='dropzone-file' className='hidden' />
                    </label>
                </div>
            </div>
        )}
    </DropZone>
}

type Props = {}

const UploadButton = (props: Props) => {

  const[open, setOPen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={(v) => {
        if(!v){
            setOPen(v);
        }
    }}>
        <DialogTrigger asChild>
            <Button onClick={() => setOPen(true)}>upload</Button>
        </DialogTrigger>
        <DialogContent>
            <UploadDropZone/>
        </DialogContent>
    </Dialog>
  )
}

export default UploadButton