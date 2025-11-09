'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Users, Camera, Settings, Plus, Edit, Trash2, Upload } from 'lucide-react'
import Link from 'next/link'

interface Karyawan {
  id: string
  nik: string
  nama: string
  email: string
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
  username?: string
  password?: string
  isActive: boolean
}

export default function AdminPage() {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([])
  const [cctvList, setCctvList] = useState<CCTV[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingKaryawan, setEditingKaryawan] = useState<Karyawan | null>(null)
  const [editingCCTV, setEditingCCTV] = useState<CCTV | null>(null)

  // Form states
  const [karyawanForm, setKaryawanForm] = useState({
    nik: '',
    nama: '',
    email: '',
    jabatan: '',
    departemen: '',
    fotoWajah: ''
  })

  const [cctvForm, setCctvForm] = useState({
    nama: '',
    lokasi: '',
    ip: '',
    port: 8080,
    username: '',
    password: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [karyawanRes, cctvRes] = await Promise.all([
        fetch('/api/karyawan'),
        fetch('/api/cctv')
      ])

      const karyawanData = await karyawanRes.json()
      const cctvData = await cctvRes.json()

      setKaryawanList(karyawanData)
      setCctvList(cctvData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKaryawanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingKaryawan ? `/api/karyawan/${editingKaryawan.id}` : '/api/karyawan'
      const method = editingKaryawan ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(karyawanForm),
      })

      if (response.ok) {
        await fetchData()
        setDialogOpen(false)
        resetKaryawanForm()
      }
    } catch (error) {
      console.error('Error saving karyawan:', error)
    }
  }

  const handleCCTVSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCCTV ? `/api/cctv/${editingCCTV.id}` : '/api/cctv'
      const method = editingCCTV ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cctvForm),
      })

      if (response.ok) {
        await fetchData()
        setDialogOpen(false)
        resetCCTVForm()
      }
    } catch (error) {
      console.error('Error saving CCTV:', error)
    }
  }

  const resetKaryawanForm = () => {
    setKaryawanForm({
      nik: '',
      nama: '',
      email: '',
      jabatan: '',
      departemen: '',
      fotoWajah: ''
    })
    setEditingKaryawan(null)
  }

  const resetCCTVForm = () => {
    setCctvForm({
      nama: '',
      lokasi: '',
      ip: '',
      port: 8080,
      username: '',
      password: ''
    })
    setEditingCCTV(null)
  }

  const handleEditKaryawan = (karyawan: Karyawan) => {
    setEditingKaryawan(karyawan)
    setKaryawanForm({
      nik: karyawan.nik,
      nama: karyawan.nama,
      email: karyawan.email,
      jabatan: karyawan.jabatan,
      departemen: karyawan.departemen,
      fotoWajah: karyawan.fotoWajah || ''
    })
    setDialogOpen(true)
  }

  const handleEditCCTV = (cctv: CCTV) => {
    setEditingCCTV(cctv)
    setCctvForm({
      nama: cctv.nama,
      lokasi: cctv.lokasi,
      ip: cctv.ip,
      port: cctv.port,
      username: cctv.username || '',
      password: cctv.password || ''
    })
    setDialogOpen(true)
  }

  const handleSetupSampleData = async () => {
    try {
      const response = await fetch('/api/setup-sample-data', {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchData()
        alert('Sample data berhasil dibuat!')
      } else {
        alert('Gagal membuat sample data')
      }
    } catch (error) {
      console.error('Error setting up sample data:', error)
      alert('Terjadi kesalahan saat membuat sample data')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setKaryawanForm(prev => ({ ...prev, fotoWajah: base64String }))
      }
      reader.readAsDataURL(file)
    }
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
            <div className="flex items-center gap-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Kembali ke Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleSetupSampleData} variant="outline">
                Setup Sample Data
              </Button>
              <Settings className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="karyawan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="karyawan">Data Karyawan</TabsTrigger>
            <TabsTrigger value="cctv">Data CCTV</TabsTrigger>
          </TabsList>

          <TabsContent value="karyawan" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Manajemen Data Karyawan
                  </CardTitle>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetKaryawanForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Karyawan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingKaryawan ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleKaryawanSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nik">NIK</Label>
                            <Input
                              id="nik"
                              value={karyawanForm.nik}
                              onChange={(e) => setKaryawanForm(prev => ({ ...prev, nik: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="nama">Nama Lengkap</Label>
                            <Input
                              id="nama"
                              value={karyawanForm.nama}
                              onChange={(e) => setKaryawanForm(prev => ({ ...prev, nama: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={karyawanForm.email}
                            onChange={(e) => setKaryawanForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="jabatan">Jabatan</Label>
                            <Input
                              id="jabatan"
                              value={karyawanForm.jabatan}
                              onChange={(e) => setKaryawanForm(prev => ({ ...prev, jabatan: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="departemen">Departemen</Label>
                            <Input
                              id="departemen"
                              value={karyawanForm.departemen}
                              onChange={(e) => setKaryawanForm(prev => ({ ...prev, departemen: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="foto">Foto Wajah</Label>
                          <Input
                            id="foto"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          {karyawanForm.fotoWajah && (
                            <div className="mt-2">
                              <img
                                src={karyawanForm.fotoWajah}
                                alt="Preview"
                                className="h-20 w-20 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Batal
                          </Button>
                          <Button type="submit">
                            {editingKaryawan ? 'Update' : 'Simpan'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Foto</th>
                        <th className="text-left p-3">NIK</th>
                        <th className="text-left p-3">Nama</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Jabatan</th>
                        <th className="text-left p-3">Departemen</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {karyawanList.map((karyawan) => (
                        <tr key={karyawan.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            {karyawan.fotoWajah ? (
                              <img
                                src={karyawan.fotoWajah}
                                alt={karyawan.nama}
                                className="h-10 w-10 object-cover rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                          </td>
                          <td className="p-3">{karyawan.nik}</td>
                          <td className="p-3 font-medium">{karyawan.nama}</td>
                          <td className="p-3">{karyawan.email}</td>
                          <td className="p-3">{karyawan.jabatan}</td>
                          <td className="p-3">{karyawan.departemen}</td>
                          <td className="p-3">
                            <Badge variant={karyawan.isActive ? "default" : "secondary"}>
                              {karyawan.isActive ? "Aktif" : "Non-aktif"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditKaryawan(karyawan)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cctv" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Manajemen Data CCTV
                  </CardTitle>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetCCTVForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah CCTV
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingCCTV ? 'Edit CCTV' : 'Tambah CCTV Baru'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCCTVSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="nama">Nama CCTV</Label>
                          <Input
                            id="nama"
                            value={cctvForm.nama}
                            onChange={(e) => setCctvForm(prev => ({ ...prev, nama: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lokasi">Lokasi</Label>
                          <Input
                            id="lokasi"
                            value={cctvForm.lokasi}
                            onChange={(e) => setCctvForm(prev => ({ ...prev, lokasi: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ip">IP Address</Label>
                            <Input
                              id="ip"
                              value={cctvForm.ip}
                              onChange={(e) => setCctvForm(prev => ({ ...prev, ip: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="port">Port</Label>
                            <Input
                              id="port"
                              type="number"
                              value={cctvForm.port}
                              onChange={(e) => setCctvForm(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="username">Username (opsional)</Label>
                            <Input
                              id="username"
                              value={cctvForm.username}
                              onChange={(e) => setCctvForm(prev => ({ ...prev, username: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="password">Password (opsional)</Label>
                            <Input
                              id="password"
                              type="password"
                              value={cctvForm.password}
                              onChange={(e) => setCctvForm(prev => ({ ...prev, password: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Batal
                          </Button>
                          <Button type="submit">
                            {editingCCTV ? 'Update' : 'Simpan'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Nama</th>
                        <th className="text-left p-3">Lokasi</th>
                        <th className="text-left p-3">IP Address</th>
                        <th className="text-left p-3">Port</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cctvList.map((cctv) => (
                        <tr key={cctv.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{cctv.nama}</td>
                          <td className="p-3">{cctv.lokasi}</td>
                          <td className="p-3">{cctv.ip}</td>
                          <td className="p-3">{cctv.port}</td>
                          <td className="p-3">
                            <Badge variant={cctv.isActive ? "default" : "secondary"}>
                              {cctv.isActive ? "Aktif" : "Non-aktif"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCCTV(cctv)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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