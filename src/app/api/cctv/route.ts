import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const cctv = await db.cCTV.findMany({
      orderBy: {
        nama: 'asc'
      }
    })
    
    return NextResponse.json(cctv)
  } catch (error) {
    console.error('Error fetching CCTV:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CCTV' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama, lokasi, ip, port, username, password } = body

    // Check if IP already exists
    const existingCCTV = await db.cCTV.findFirst({
      where: { ip }
    })

    if (existingCCTV) {
      return NextResponse.json(
        { error: 'CCTV with this IP already exists' },
        { status: 400 }
      )
    }

    const cctv = await db.cCTV.create({
      data: {
        nama,
        lokasi,
        ip,
        port,
        username,
        password
      }
    })

    return NextResponse.json(cctv, { status: 201 })
  } catch (error) {
    console.error('Error creating CCTV:', error)
    return NextResponse.json(
      { error: 'Failed to create CCTV' },
      { status: 500 }
    )
  }
}