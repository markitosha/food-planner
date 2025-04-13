import getDatabase from '@/db/getDatabase';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function GET() {
  const sql = await getDatabase();
  const data = await sql`SELECT id, hf_json FROM recipes;`;
  const images: any[] = data.map((item) => ({
    id: item.id,
    img: 'https://img.hellofresh.com/hellofresh_s3' + item.hf_json.imagePath,
  }));

  for (const item of images) {
    const { img, id } = item;

    const res = await fetch(img);
    const blob = await res.blob();

    const { url } = await put(`recipes/${id}.jpeg`, blob, {
      access: 'public',
    });

    await sql`UPDATE recipes SET image_url = ${url} WHERE id = ${id};`;
  }

  // const { url } = await put('images/blob.txt', 'Hello World!', {
  //   access: 'public',
  // });

  return NextResponse.json({
    message: `Hello from the API!`,
    date: new Date().toISOString(),
    images,
  });
}
