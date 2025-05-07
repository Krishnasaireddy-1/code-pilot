import prisma from '@/app/lib/prisma'
import { getCurrentUser } from '@/app/utils/getCurrentUser'

export async function GET() {
  const user = await getCurrentUser({ includeFriends: true }); // <-- pass custom param if needed
  if (!user) return new Response('Unauthorized', { status: 401 });

  const friendIds = user.friends?.map(f => f.id) || [];

  const friends = await prisma.user.findMany({
    where: { id: { in: friendIds } },
    select: { id: true, name: true },
  });

  return Response.json(friends);
}
