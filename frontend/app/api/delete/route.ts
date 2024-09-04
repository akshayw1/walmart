import { del } from '@vercel/blob';
 
export const runtime = 'edge';
 
export async function DELETE(request: Request) {
  const { url } = await request.json();
  await del(url as string);
  return new Response();
}