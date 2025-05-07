import prisma from '@/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany({ select: { id: true, name: true } })
  return Response.json(users)
}
