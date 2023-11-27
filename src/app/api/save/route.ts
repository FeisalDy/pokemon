import User from '@/models/User'
import connect from '@/lib/db'
import { NextResponse } from 'next/server'

export const PATCH = async (req: any) => {
  const { email, pet } = await req.json()

  try {
    await connect()

    const existingUser = await User.findOne({ email: email })
    if (!existingUser) return new Response('User not found', { status: 404 })

    // existingUser.pets = pet

    if (!existingUser.pets.includes(pet)) {
      existingUser.pets.push(pet)
    }

    await existingUser.save()
    return new NextResponse(JSON.stringify(existingUser), { status: 200 })
  } catch (error) {
    return new NextResponse('Error update', { status: 500 })
  }
}

export const DELETE = async (req: any) => {
  const { email, pet } = await req.json()

  try {
    await connect()

    const existingUser = await User.findOne({ email: email })
    if (!existingUser) return new Response('User not found', { status: 404 })

    // Remove the pet from the user's pets array
    existingUser.pets = existingUser.pets.filter(p => p !== pet)

    await existingUser.save()
    return new NextResponse(JSON.stringify(existingUser), { status: 200 })
  } catch (error) {
    return new NextResponse('Error deleting', { status: 500 })
  }
}
