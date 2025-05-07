import { cookies } from 'next/headers';
import prisma from '@/app/lib/prisma';

export async function getCurrentUser(options = {}) {
  const cookieStore = await cookies(); // ✅ Await the cookies call

  const userId = cookieStore.get('userId')?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: options.includeFriends ? { friends: true } : {},
  });

  return user;
}
