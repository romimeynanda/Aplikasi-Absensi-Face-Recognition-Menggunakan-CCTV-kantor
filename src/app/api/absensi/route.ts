import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const absensi = await db.absensi.findMany({
      include: {
        karyawan: true,
        cctv: true
      },
      orderBy: {
        waktuAbsen: 'desc'
      }
    })
    
    return NextResponse.json(absensi)
  } catch (error) {
    console.error('Error fetching absensi:', error)
    return NextResponse.json(
      { error: 'Failed to fetch absensi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { karyawanId, cctvId, tipeAbsen, confidence, fotoAbsen } = body

    // Check if employee already has attendance for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingAbsensi = await db.absensi.findFirst({
      where: {
        karyawanId,
        tipeAbsen,
        waktuAbsen: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    if (existingAbsensi) {
      return NextResponse.json(
        { error: 'Employee already has attendance for today' },
        { status: 400 }
      )
    }

    const absensi = await db.absensi.create({
      data: {
        karyawanId,
        cctvId,
        tipeAbsen,
        confidence,
        fotoAbsen
      },
      include: {
        karyawan: true,
        cctv: true
      }
    })

    return NextResponse.json(absensi, { status: 201 })
  } catch (error) {
    console.error('Error creating absensi:', error)
    return NextResponse.json(
      { error: 'Failed to create absensi' },
      { status: 500 }
    )
  }
}