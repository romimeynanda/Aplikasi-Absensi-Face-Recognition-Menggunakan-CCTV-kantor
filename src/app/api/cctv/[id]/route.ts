import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { nama, lokasi, ip, port, username, password, isActive } = body

    const cctv = await db.cCTV.update({
      where: { id: params.id },
      data: {
        nama,
        lokasi,
        ip,
        port,
        username,
        password,
        isActive
      }
    })

    return NextResponse.json(cctv)
  } catch (error) {
    console.error('Error updating CCTV:', error)
    return NextResponse.json(
      { error: 'Failed to update CCTV' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.cCTV.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'CCTV deleted successfully' })
  } catch (error) {
    console.error('Error deleting CCTV:', error)
    return NextResponse.json(
      { error: 'Failed to delete CCTV' },
      { status: 500 }
    )
  }
}