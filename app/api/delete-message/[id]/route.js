// import prisma from '@/app/lib/prisma'
// import { getCurrentUser } from '@/app/utils/getCurrentUser'
// import { NextResponse } from 'next/server'

// export async function DELETE(req, { params }) {
//   const me = await getCurrentUser()
//   if (!me) return new NextResponse('Unauthorized', { status: 401 })

//   const messageId = params.id

//   try {
//     // Check if the message belongs to the current user
//     const message = await prisma.message.findUnique({
//       where: { id: messageId },
//     })

//     if (!message || message.senderId !== me.id) {
//       return new NextResponse('Forbidden', { status: 403 })
//     }

//     await prisma.message.delete({
//       where: { id: messageId },
//     })

//     return NextResponse.json({ message: 'Deleted successfully' })
//   } catch (err) {
//     console.error(err)
//     return new NextResponse('Server Error', { status: 500 })
//   }
// }

import prisma from '@/app/lib/prisma'
import { getCurrentUser } from '@/app/utils/getCurrentUser'
import { NextResponse } from 'next/server'

export async function DELETE(req, contextPromise) {
  const context = await contextPromise // 👈 await the context object
  const { params } = context

  const me = await getCurrentUser()
  if (!me) return new NextResponse("Unauthorized", { status: 401 })

  const messageId = params?.id

  if (!messageId) {
    return new NextResponse("Invalid message ID", { status: 400 })
  }

  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message || message.senderId !== me.id) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    await prisma.message.delete({
      where: { id: messageId },
    })

    return NextResponse.json({ message: "Deleted successfully" })
  } catch (err) {
    console.error(err)
    return new NextResponse("Server Error", { status: 500 })
  }
}
