'use client';

import { Button, Card, CardFooter } from '@nextui-org/react';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { Loader2Icon, Play, UploadCloudIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { io } from 'socket.io-client';
import { Item } from '@/components/VideoPlayer';

function generateThumbnail(videoFile: File, seekTime = 0): Promise<Blob> {
  return new Promise(resolve => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      video.currentTime = seekTime;
    };
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
        }, 'image/png');
      }
    };
    video.src = URL.createObjectURL(videoFile);
  });
}

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<(PutBlobResult & { thumbnail?: string }) | null>(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = () => {
    if (inputFileRef.current?.files) {
      setFileName(inputFileRef.current.files[0].name);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];
    const newBlob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
      multipart: true,
      contentType: file.type,
    });

    if (file.type.split('/')[0] === 'video') {
      const thumbnailBlob = await generateThumbnail(file);
      const thumbnail = await upload(`.thumbnail/${file.name.split('.')?.at(-2)}.png`, thumbnailBlob, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        multipart: true,
      });

      setBlob({ ...newBlob, thumbnail: thumbnail.url });
    } else if (file.type.split('/')[0] === 'image') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        transports: ['websocket'],
      });

      reader.onloadend = async () => {
        const base64 = reader.result;
        socket?.emit('send_data', { data: base64 });
      };

      socket?.on('data_processed', (data: Item[]) => {
        // UI need to be made for this
        console.log(data);
      });

      setTimeout(() => {
        socket?.disconnect();
      }, 10000);
    } else {
      alert('Invalid file type');
    }
    setIsUploading(false);
  };

  return (
    <div
      className='relative w-screen h-screen bg-cover bg-center bg-black bg-opacity-50'
      style={{
        backgroundImage:
          "url('https://e0.pxfuel.com/wallpapers/724/281/desktop-wallpaper-get-amazon-prime-video-for-windows-amazon.jpg')",
      }}
    >
      <div className='bg-gradient-to-r from-black via-slate-900 bg-opacity-50 w-full h-full'>
        <header className='flex justify-between items-center z-10 h-12 w-full bg-indigo-900-600 px-64'>
          <Link href='/' className='text-white text-2xl'>
            SmartShopAR
          </Link>
          <div className='flex space-x-4'>
            <Button as='a' href='/upload' variant='light' style={{ color: 'white' }}>
              Upload <UploadCloudIcon size={24} />
            </Button>
          </div>
        </header>
        <main className='relative p-12 flex flex-col justify-between h-4/5 z-10'>
          <div>
            <h1 className='text-4xl font-bold'>Upload Videos your own videos</h1>
            <p className='w-1/2 my-6 text-lg' >
              Welcome to SmartShopAR upload feature, where you can seamlessly upload your videos and leverage
              cutting-edge machine learning technology to detect objects within them. Whether youre showcasing your
              latest project or sharing memorable moments, our platform ensures a streamlined experience. Simply select
              your video file, upload it securely, and our advanced ML algorithms will analyze its contents to identify
              objects of interest. Explore the possibilities of intelligent video processing today, backed by the
              reliability and innovation of SmartShopAR.
            </p>
          </div>
          <div className='flex justify-around'>
            <form onSubmit={handleUpload} className='flex flex-col w-1/5'>
              <label
                htmlFor='file-upload'
                className='relative cursor-pointer bg-gray-900 py-2 px-4 rounded-lg border border-gray-300'
              >
                <span className='text-lg'>Choose a file</span>
                <input
                  id='file-upload'
                  ref={inputFileRef}
                  type='file'
                  className='hidden'
                  required
                  onChange={handleFileChange}
                />
              </label>
              {fileName && <p className='mt-2 text-lg text-gray-400'>{fileName}</p>}
              <Button
                className='mt-4 bg-indigo-900-600 text-white rounded-lg py-2 px-4 hover:bg-indigo-900-700'
                size='lg'
                type='submit'
              >
                {isUploading ? 'Uploading...' : 'Upload'}{' '}
                {isUploading ?
                  <Loader2Icon size={24} className='animate-spin' />
                : <UploadCloudIcon size={24} />}
              </Button>
            </form>

            {/* UI for Image upload results need to be made */}

            {blob && (
              <Link
                href={{
                  pathname: '/stream',
                  query: {
                    url: blob?.url,
                    pathname: blob?.pathname,
                    size: 'NA',
                    uploadedAt: 'Now',
                  },
                }}
              >
                <Card
                  key={blob?.pathname}
                  isHoverable
                  isPressable
                  radius='lg'
                  className='border-none w-52 justify-center bg-indigo-900-600 hover:scale-110'
                >
                  <div className='relative'>
                    <Image
                      // loading='lazy'
                      alt={blob?.pathname ?? 'Video'}
                      className='object-cover'
                      height={500}
                      src={
                        blob?.thumbnail ??
                        'https://d8it4huxumps7.cloudfront.net/uploads/images/663c619d69486_hackon-with-amazon-season-4.jpg?d=1920x1920'
                      }
                      width={500}
                    />
                    <div className='absolute inset-0 flex z-10 items-center justify-center rounded-xl bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity'>
                      <Play size={48} color='white' />
                    </div>
                  </div>
                  <CardFooter className='justify-between'>
                    <p className='text-small text-white text-wrap'>
                      {blob?.pathname.split('/').pop()?.split('.')?.at(-2)}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
