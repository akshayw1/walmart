'use client';

import VideoPlayer from '@/components/VideoPlayer';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function StreamPage({ searchParams}: { searchParams: Record<string, string | string[] | undefined> }) {
  const url = searchParams.url;
  const pathname = searchParams.pathname;
  const size = searchParams?.size;
  const uploadedAt = searchParams?.uploadedAt;

  const deleteVideo = async () => {
    if (url) {
      const res = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const processingURL = new URL(url as string);
      const thumbnail = `https://${processingURL.hostname}/.thumbnail/${processingURL.pathname?.split('/')?.pop()?.split('.')?.at(-2)}.png`;

      await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: thumbnail }),
      });
      if (res.ok) {
        alert('Video deleted successfully');
        window.location.href = '/';
      } else {
        alert('Failed to delete video');
      }
    }
  };

  return (
    <div className='flex align-middle flex-col'>
      <VideoPlayer />
      {((url as string)?.split('/')?.at(-2)?.split('.')?.length ?? 0) > 1 && (
        <Button className='self-end mr-16 w-1/12' variant='shadow' color='danger' onClick={deleteVideo}>
          Delete
        </Button>
      )}
      <div className='mt-4 ml-10 w-11/12 justify-center mb-4'>
        <Table aria-label='Example static collection table'>
          <TableHeader>
            <TableColumn>VIDEO DETAILS</TableColumn>
            <TableColumn> </TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key='1'>
              <TableCell>PATHNAME</TableCell>
              <TableCell>{pathname}</TableCell>
            </TableRow>
            <TableRow key='2'>
              <TableCell>URL</TableCell>
              <TableCell>{url}</TableCell>
            </TableRow>
            <TableRow key='3'>
              <TableCell>SIZE</TableCell>
              <TableCell>{size}</TableCell>
            </TableRow>
            <TableRow key='4'>
              <TableCell>UPLOADED AT</TableCell>
              <TableCell>{uploadedAt}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}