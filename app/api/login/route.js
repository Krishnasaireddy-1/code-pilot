import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Compare entered password with hashed password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    cookies().set('userId', user.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return new NextResponse('Error during login', { status: 500 });
  }
}
