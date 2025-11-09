import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const absensi = await db.absensi.findMany({
      where: {
        waktuAbsen: {
          gte: today,
          lt: tomorrow
        }
      },
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
    console.error('Error fetching today absensi:', error)
    return NextResponse.json(
      { error: 'Failed to fetch today absensi' },
      { status: 500 }
    )
  }
}