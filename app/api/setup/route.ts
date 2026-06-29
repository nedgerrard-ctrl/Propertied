import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ message: 'Invalid email or password (min 8 chars).' }, { status: 400 })
    }

    await connectDB()

    const passwordHash = await bcrypt.hash(password, 12)

    await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'admin',
        name: 'Ned Gerrard',
        firstName: 'Ned',
        lastName: 'Gerrard',
        emailVerified: true,
        status: 'active',
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Setup error:', err)
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 })
  }
}
