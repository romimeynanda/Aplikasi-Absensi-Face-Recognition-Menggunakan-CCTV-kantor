import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    // Create sample employees
    const employees = [
      {
        nik: '001',
        nama: 'Ahmad Wijaya',
        email: 'ahmad@company.com',
        jabatan: 'Software Engineer',
        departemen: 'IT',
        isActive: true
      },
      {
        nik: '002',
        nama: 'Siti Nurhaliza',
        email: 'siti@company.com',
        jabatan: 'HR Manager',
        departemen: 'HR',
        isActive: true
      },
      {
        nik: '003',
        nama: 'Budi Santoso',
        email: 'budi@company.com',
        jabatan: 'Marketing Manager',
        departemen: 'Marketing',
        isActive: true
      },
      {
        nik: '004',
        nama: 'Dewi Lestari',
        email: 'dewi@company.com',
        jabatan: 'Finance Manager',
        departemen: 'Finance',
        isActive: true
      },
      {
        nik: '005',
        nama: 'Rudi Hermawan',
        email: 'rudi@company.com',
        jabatan: 'Operations Manager',
        departemen: 'Operations',
        isActive: true
      }
    ]

    // Create sample CCTV
    const cctvs = [
      {
        nama: 'CCTV Utama',
        lokasi: 'Lobi Utama',
        ip: '192.168.1.100',
        port: 8080,
        username: 'admin',
        password: 'password',
        isActive: true
      },
      {
        nama: 'CCTV Ruang Server',
        lokasi: 'Ruang Server IT',
        ip: '192.168.1.101',
        port: 8080,
        username: 'admin',
        password: 'password',
        isActive: true
      },
      {
        nama: 'CCTV Parkir',
        lokasi: 'Area Parkir',
        ip: '192.168.1.102',
        port: 8080,
        username: 'admin',
        password: 'password',
        isActive: false
      }
    ]

    // Insert employees
    for (const employee of employees) {
      await db.karyawan.upsert({
        where: { nik: employee.nik },
        update: employee,
        create: employee
      })
    }

    // Insert CCTV
    for (const cctv of cctvs) {
      await db.cCTV.upsert({
        where: { ip: cctv.ip },
        update: cctv,
        create: cctv
      })
    }

    return NextResponse.json({
      message: 'Sample data created successfully',
      employees: employees.length,
      cctvs: cctvs.length
    })
  } catch (error) {
    console.error('Error creating sample data:', error)
    return NextResponse.json(
      { error: 'Failed to create sample data' },
      { status: 500 }
    )
  }
}