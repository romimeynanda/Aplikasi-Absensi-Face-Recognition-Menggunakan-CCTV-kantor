import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageData, cctvId } = body

    if (!imageData || !cctvId) {
      return NextResponse.json(
        { error: 'Image data and CCTV ID are required' },
        { status: 400 }
      )
    }

    // Get all active employees
    const karyawan = await db.karyawan.findMany({
      where: {
        isActive: true,
        fotoWajah: {
          not: null
        }
      }
    })

    if (karyawan.length === 0) {
      return NextResponse.json(
        { error: 'No active employees found' },
        { status: 404 }
      )
    }

    // Use ZAI for face recognition
    const zai = await ZAI.create()
    
    let recognizedEmployee = null
    let highestConfidence = 0

    // Compare face with each employee
    for (const employee of karyawan) {
      try {
        const comparison = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a face recognition system. Compare two face images and return a confidence score between 0 and 1, where 1 is a perfect match. Return only the number.'
            },
            {
              role: 'user',
              content: `Compare these two face images and return confidence score:
              
              Known employee face: ${employee.fotoWajah}
              
              Current camera face: ${imageData}
              
              Return only a number between 0 and 1.`
            }
          ],
          temperature: 0.1,
          max_tokens: 10
        })

        const confidence = parseFloat(comparison.choices[0]?.message?.content || '0')
        
        if (confidence > highestConfidence && confidence > 0.7) { // Threshold for recognition
          highestConfidence = confidence
          recognizedEmployee = employee
        }
      } catch (error) {
        console.error('Error comparing face:', error)
        continue
      }
    }

    if (!recognizedEmployee) {
      return NextResponse.json({
        success: false,
        message: 'No face recognized',
        confidence: 0
      })
    }

    // Check current time to determine attendance type
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const morningTime = 7 * 60 + 30 // 7:30 AM
    const eveningTime = 16 * 60 // 4:00 PM

    let tipeAbsen = currentTime < morningTime ? 'masuk' : 'pulang'
    
    // Check if employee already has attendance for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingAbsensi = await db.absensi.findFirst({
      where: {
        karyawanId: recognizedEmployee.id,
        tipeAbsen,
        waktuAbsen: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    if (existingAbsensi) {
      return NextResponse.json({
        success: false,
        message: 'Employee already has attendance for today',
        employee: recognizedEmployee,
        confidence: highestConfidence
      })
    }

    // Create attendance record
    const absensi = await db.absensi.create({
      data: {
        karyawanId: recognizedEmployee.id,
        cctvId,
        tipeAbsen,
        confidence: highestConfidence,
        fotoAbsen: imageData
      },
      include: {
        karyawan: true,
        cctv: true
      }
    })

    return NextResponse.json({
      success: true,
      message: `Attendance recorded for ${recognizedEmployee.nama}`,
      employee: recognizedEmployee,
      attendance: absensi,
      confidence: highestConfidence
    })

  } catch (error) {
    console.error('Error in face recognition:', error)
    return NextResponse.json(
      { error: 'Failed to process face recognition' },
      { status: 500 }
    )
  }
}