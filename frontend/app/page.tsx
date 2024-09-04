import Link from 'next/link';
import Card from '../components/CardComponent';
import { Button } from '@nextui-org/react';
import { UploadCloudIcon } from 'lucide-react';


export default function Home() {
  return (
    <div
      className='relative w-screen h-screen bg-cover bg-center bg-no-repeat bg-black bg-opacity-50'
      style={{
        backgroundImage:
          "url('https://e0.pxfuel.com/wallpapers/724/281/desktop-wallpaper-get-amazon-prime-video-for-windows-amazon.jpg')",
      }}
    >
      <div className='bg-gradient-to-r from-black via-slate-900 bg-opacity-50 w-full h-full'>
        <header className='flex flex-row justify-between items-center z-10 h-12 w-full bg-indigo-900 px-64'>
          <Link href='/' className='text-slate-50 text-2xl'>
            SmartShopAR
          </Link>
          <div className='flex flex-row space-x-4 text-lg'>
            <Button as={'a'} href='/upload' variant='light' className='text-slate-200'>
              Upload <UploadCloudIcon size={24} />
            </Button>
          </div>
        </header>
        <main className='relative p-12 flex flex-col justify-between h-4/5 z-10'>
          <div>
            <p className='text-4xl font-bold'>Welcome to SmartShopAR</p>
            <p className='text-lg my-6'>
              Join Prime to watch the latest movies, TV shows and award-winning <br /> Amazon Originals and feel free to{' '}
              <a href='https://www.amazon.in/'>
                <b>
                  <u>buy</u>
                </b>
              </a>{' '}
              <br /> products you like in the video
            </p>
            <div className='mt-12 mb-4 h-12 rounded-xl align-middle px-6 py-2 bg-gradient-to-r w-1/2 from-slate-700 via-slate-900 bg-opacity-50'>
              <p className='text-lg'>Videos</p>
            </div>
            <Card />
          </div>
        </main>
      </div>
    </div>
  );
}
