import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const karyawan = await db.karyawan.findMany({
      orderBy: {
        nama: 'asc'
      }
    })
    
    return NextResponse.json(karyawan)
  } catch (error) {
    console.error('Error fetching karyawan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch karyawan' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nik, nama, email, jabatan, departemen, fotoWajah } = body

    // Check if NIK or email already exists
    const existingKaryawan = await db.karyawan.findFirst({
      where: {
        OR: [
          { nik },
          { email }
        ]
      }
    })

    if (existingKaryawan) {
      return NextResponse.json(
        { error: 'NIK or Email already exists' },
        { status: 400 }
      )
    }

    const karyawan = await db.karyawan.create({
      data: {
        nik,
        nama,
        email,
        jabatan,
        departemen,
        fotoWajah
      }
    })

    return NextResponse.json(karyawan, { status: 201 })
  } catch (error) {
    console.error('Error creating karyawan:', error)
    return NextResponse.json(
      { error: 'Failed to create karyawan' },
      { status: 500 }
    )
  }
}