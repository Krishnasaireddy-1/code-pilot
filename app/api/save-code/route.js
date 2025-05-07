import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/utils/getCurrentUser';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { title, content, language } = await req.json();

  try {
    await prisma.code.create({
      data: {
        title,
        content,
        language,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return new NextResponse('Failed to save code', { status: 500 });
  }
}
