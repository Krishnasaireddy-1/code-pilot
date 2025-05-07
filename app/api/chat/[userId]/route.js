import prisma from '@/app/lib/prisma'
import { getCurrentUser } from '@/app/utils/getCurrentUser'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const me = await getCurrentUser()
  if (!me) return new Response('Unauthorized', { status: 401 })

  // 🛠️ Extract userId from URL (e.g., /api/chat/123)
  const url = new URL(req.url)
  const userId = url.pathname.split('/').pop()

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: me.id, receiverId: userId },
        { senderId: userId, receiverId: me.id },
      ],
    },
    orderBy: { timestamp: 'asc' }
  })

  return NextResponse.json(messages)
}
