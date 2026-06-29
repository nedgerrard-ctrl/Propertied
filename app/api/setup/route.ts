export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email    = (body.email    ?? '').toLowerCase().trim()
    const password =  body.password ?? ''

    if (!email || password.length < 8) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 400 })
    }

    await connectDB()

    const passwordHash = await bcrypt.hash(password, 10)

    await User.findOneAndUpdate(
      { email },
      {
        email,
        passwordHash,
        role:          'admin',
        name:          'Ned Gerrard',
        firstName:     'Ned',
        lastName:      'Gerrard',
        emailVerified: true,
        accountStatus: 'active',
      },
      { upsert: true, new: true, runValidators: false }
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Setup error:', msg)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
