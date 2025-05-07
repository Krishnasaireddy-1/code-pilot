import prisma from '@/app/lib/prisma'
import { getCurrentUser } from '@/app/utils/getCurrentUser'

export async function POST(req) {
  const me = await getCurrentUser()
  if (!me) return new Response('Unauthorized', { status: 401 })

  const { friendId } = await req.json()

  await prisma.user.update({
    where: { id: me.id },
    data: {
      friends: {
        connect: { id: friendId },
      },
    },
  })

  return Response.json({ success: true })
}
