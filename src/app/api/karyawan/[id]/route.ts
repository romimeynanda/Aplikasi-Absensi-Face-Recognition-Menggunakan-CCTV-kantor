import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { nik, nama, email, jabatan, departemen, fotoWajah, isActive } = body

    const karyawan = await db.karyawan.update({
      where: { id: params.id },
      data: {
        nik,
        nama,
        email,
        jabatan,
        departemen,
        fotoWajah,
        isActive
      }
    })

    return NextResponse.json(karyawan)
  } catch (error) {
    console.error('Error updating karyawan:', error)
    return NextResponse.json(
      { error: 'Failed to update karyawan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.karyawan.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Karyawan deleted successfully' })
  } catch (error) {
    console.error('Error deleting karyawan:', error)
    return NextResponse.json(
      { error: 'Failed to delete karyawan' },
      { status: 500 }
    )
  }
}