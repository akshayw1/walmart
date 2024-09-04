import { withNextVideo } from 'next-video/process';
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dt7dtd4k67apw38c.public.blob.vercel-storage.com',
        port: '',
        pathname: '*',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Accept',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          }
        ],
      },
    ];
  },
};

export default withNextVideo(nextConfig, {
  provider: 'vercel-blob',
  providerConfig: {
    'vercel-blob': {
      generateAssetKey(filePath, folder) {
        return filePath;
      },
    },
  },
  folder: 'videos'
});
