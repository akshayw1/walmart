import React from 'react';
import { Card, CardFooter, Image } from '@nextui-org/react';
import { list } from '@vercel/blob';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default async function CardComponent() {
  const { blobs } = await list({ mode: 'folded', prefix: 'videos/' });
  const { blobs: thumbnails } = await list({ mode: 'folded', prefix: '.thumbnail/' });

  return (
    <div className='flex flex-wrap gap-8'>
      {blobs &&
        blobs.map(({ pathname, url, size, uploadedAt }) => (
          <Link
            href={{
              pathname: '/stream',
              query: {
                url: url,
                pathname: pathname,
                size: size,
                uploadedAt: uploadedAt.toLocaleString(),
              },
            }}
            key={pathname}
          >
            <Card
              key={pathname}
              isHoverable
              isPressable
              radius='lg'
              className='border-none w-52 justify-center bg-indigo-900 hover:scale-110'
            >
              <div className='relative'>
                <Image
                  loading='lazy'
                  alt={pathname}
                  className='object-cover'
                  height={500}
                  src={thumbnails?.find((blob) => blob.pathname === `.thumbnail/${pathname.split('/').pop()?.split('.')?.at(-2)}.png`)?.url}
                  width={500}
                />
                <div className='absolute inset-0 flex z-10 items-center justify-center rounded-xl bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity'>
                  <Play size={48} color='white' />
                </div>
              </div>
              <CardFooter className='justify-between'>
                <p className='text-small text-white text-wrap'>{pathname.split('/').pop()?.split('.')?.at(-2)}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
    </div>
  );
}
