import prisma from '../../lib/prisma'
import { getCurrentUser } from '../../utils/getCurrentUser'

export async function GET() {
  const me = await getCurrentUser()
  if (!me) return new Response('Unauthorized', { status: 401 })

  const myFriends = await prisma.user.findUnique({
    where: { id: me.id },
    select: { friends: { select: { id: true } } },
  })

  const friendIds = myFriends.friends.map((f) => f.id)

  const suggestions = await prisma.user.findMany({
    where: {
      id: {
        notIn: [...friendIds, me.id],
      },
    },
    select: { id: true, name: true },
  })

  return Response.json(suggestions)
}
