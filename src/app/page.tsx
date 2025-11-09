'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Camera, Clock, CheckCircle, XCircle, Settings } from 'lucide-react'
import Link from 'next/link'

interface Karyawan {
  id: string
  nik: string
  nama: string
  jabatan: string
  departemen: string
  fotoWajah?: string
  isActive: boolean
}

interface CCTV {
  id: string
  nama: string
  lokasi: string
  ip: string
  port: number
  isActive: boolean
}

interface Absensi {
  id: string
  karyawanId: string
  cctvId: string
  tipeAbsen: string
  waktuAbsen: string
  confidence: number
  isVerified: boolean
  karyawan: Karyawan
  cctv: CCTV
}

export default function Home() {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([])
  const [cctvList, setCctvList] = useState<CCTV[]>([])
  const [absensiList, setAbsensiList] = useState<Absensi[]>([])
  const [activeCCTV, setActiveCCTV] = useState<CCTV[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh setiap 5 detik
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [karyawanRes, cctvRes, absensiRes] = await Promise.all([
        fetch('/api/karyawan'),
        fetch('/api/cctv'),
        fetch('/api/absensi/today')
      ])

      const karyawanData = await karyawanRes.json()
      const cctvData = await cctvRes.json()
      const absensiData = await absensiRes.json()

      setKaryawanList(karyawanData)
      setCctvList(cctvData)
      setAbsensiList(absensiData)
      setActiveCCTV(cctvData.filter((cctv: CCTV) => cctv.isActive))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAttendanceStatus = (karyawan: Karyawan) => {
    const today = new Date().toDateString()
    const todayAbsensi = absensiList.filter(absen => 
      absen.karyawanId === karyawan.id && 
      new Date(absen.waktuAbsen).toDateString() === today
    )

    const hasMasuk = todayAbsensi.some(absen => absen.tipeAbsen === 'masuk')
    const hasPulang = todayAbsensi.some(absen => absen.tipeAbsen === 'pulang')

    if (hasMasuk && hasPulang) return { status: 'complete', label: 'Hadir & Pulang', color: 'bg-green-500' }
    if (hasMasuk) return { status: 'present', label: 'Hadir', color: 'bg-blue-500' }
    return { status: 'absent', label: 'Belum Hadir', color: 'bg-gray-400' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistem Absensi Face Recognition</h1>
              <p className="text-gray-600 mt-2">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {absensiList.filter(a => a.tipeAbsen === 'masuk').length}
                </div>
                <div className="text-sm text-gray-600">Hadir</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {absensiList.filter(a => a.tipeAbsen === 'pulang').length}
                </div>
                <div className="text-sm text-gray-600">Pulang</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {karyawanList.filter(k => k.isActive).length - absensiList.filter(a => a.tipeAbsen === 'masuk').length}
                </div>
                <div className="text-sm text-gray-600">Belum Hadir</div>
              </div>
              <Link href="/admin">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="cctv">CCTV Monitor</TabsTrigger>
            <TabsTrigger value="attendance">Daftar Hadir</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CCTV Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Status CCTV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cctvList.map((cctv) => (
                      <div key={cctv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{cctv.nama}</div>
                          <div className="text-sm text-gray-600">{cctv.lokasi}</div>
                        </div>
                        <Badge variant={cctv.isActive ? "default" : "secondary"}>
                          {cctv.isActive ? "Aktif" : "Non-aktif"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Attendance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Absensi Terkini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {absensiList.slice(0, 10).map((absen) => (
                      <div key={absen.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{absen.karyawan.nama}</div>
                          <div className="text-sm text-gray-600">{absen.karyawan.jabatan}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatTime(absen.waktuAbsen)}</div>
                          <Badge variant={absen.tipeAbsen === 'masuk' ? "default" : "secondary"}>
                            {absen.tipeAbsen === 'masuk' ? "Masuk" : "Pulang"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cctv" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeCCTV.map((cctv) => (
                <Card key={cctv.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      {cctv.nama}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">CCTV Stream</p>
                        <p className="text-xs opacity-50 mt-1">{cctv.ip}:{cctv.port}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-600">{cctv.lokasi}</span>
                      <Badge variant="outline">Deteksi Aktif</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Daftar Kehadiran Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">NIK</th>
                        <th className="text-left p-3">Nama</th>
                        <th className="text-left p-3">Jabatan</th>
                        <th className="text-left p-3">Departemen</th>
                        <th className="text-left p-3">Jam Masuk</th>
                        <th className="text-left p-3">Jam Pulang</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {karyawanList.filter(k => k.isActive).map((karyawan) => {
                        const status = getAttendanceStatus(karyawan)
                        const todayAbsensi = absensiList.filter(absen => 
                          absen.karyawanId === karyawan.id && 
                          new Date(absen.waktuAbsen).toDateString() === new Date().toDateString()
                        )
                        const masuk = todayAbsensi.find(a => a.tipeAbsen === 'masuk')
                        const pulang = todayAbsensi.find(a => a.tipeAbsen === 'pulang')

                        return (
                          <tr key={karyawan.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{karyawan.nik}</td>
                            <td className="p-3 font-medium">{karyawan.nama}</td>
                            <td className="p-3">{karyawan.jabatan}</td>
                            <td className="p-3">{karyawan.departemen}</td>
                            <td className="p-3">{masuk ? formatTime(masuk.waktuAbsen) : '-'}</td>
                            <td className="p-3">{pulang ? formatTime(pulang.waktuAbsen) : '-'}</td>
                            <td className="p-3">
                              <Badge 
                                className={`${status.color} text-white`}
                                variant="secondary"
                              >
                                {status.label}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}