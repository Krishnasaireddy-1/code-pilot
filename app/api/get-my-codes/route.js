import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/utils/getCurrentUser';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const codes = await prisma.code.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ codes });
  } catch (err) {
    console.error(err);
    return new NextResponse('Failed to fetch codes', { status: 500 });
  }
}
