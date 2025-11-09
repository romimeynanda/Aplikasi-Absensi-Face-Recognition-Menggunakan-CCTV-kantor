# Aplikasi Absensi Face Recognition

Aplikasi absensi berbasis website dengan teknologi face recognition menggunakan CCTV kantor.

## Fitur Utama

### 1. Dashboard Utama (/)
- **Real-time Attendance**: Menampilkan daftar karyawan yang hadir secara real-time
- **CCTV Monitor**: Menampilkan status dan lokasi CCTV yang aktif
- **Attendance List**: Daftar lengkap kehadiran hari ini dengan jam masuk dan pulang
- **Statistics**: Jumlah karyawan hadir, pulang, dan belum hadir

### 2. Admin Panel (/admin)
- **Data Karyawan**: 
  - Tambah, edit, dan hapus data karyawan
  - Upload foto wajah untuk face recognition
  - Management status aktif/non-aktif
- **Data CCTV**:
  - Tambah, edit, dan hapus data CCTV
  - Konfigurasi IP, port, dan kredensial CCTV
  - Management status aktif/non-aktif
- **Setup Sample Data**: Tombol untuk membuat data contoh

## Cara Penggunaan

### 1. Setup Awal
1. Buka halaman `/admin`
2. Klik tombol "Setup Sample Data" untuk membuat data contoh
3. Atau tambah data karyawan dan CCTV secara manual

### 2. Menambah Karyawan
1. Di halaman admin, pilih tab "Data Karyawan"
2. Klik "Tambah Karyawan"
3. Isi data lengkap (NIK, nama, email, jabatan, departemen)
4. Upload foto wajah (wajib untuk face recognition)
5. Klik "Simpan"

### 3. Menambah CCTV
1. Di halaman admin, pilih tab "Data CCTV"
2. Klik "Tambah CCTV"
3. Isi data CCTV (nama, lokasi, IP, port, username, password)
4. Klik "Simpan"

### 4. Proses Absensi
- **Waktu Masuk**: 07:30 pagi atau lebih awal
- **Waktu Pulang**: 16:00 sore atau lebih
- **Face Recognition**: Sistem akan otomatis mendeteksi wajah karyawan melalui CCTV
- **Pencegahan Duplikasi**: Karyawan yang sudah absen tidak akan dideteksi lagi hari itu

## Teknologi yang Digunakan

### Frontend
- Next.js 15 dengan App Router
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui components
- Lucide icons

### Backend
- Next.js API Routes
- Prisma ORM dengan SQLite
- ZAI Web Dev SDK untuk face recognition
- Socket.io untuk real-time communication

### Database Schema
- **Karyawan**: Data karyawan dengan foto wajah
- **CCTV**: Data konfigurasi CCTV
- **Absensi**: Record kehadiran dengan confidence score

## API Endpoints

### Karyawan
- `GET /api/karyawan` - Get all employees
- `POST /api/karyawan` - Create new employee
- `PUT /api/karyawan/[id]` - Update employee
- `DELETE /api/karyawan/[id]` - Delete employee

### CCTV
- `GET /api/cctv` - Get all CCTV
- `POST /api/cctv` - Create new CCTV
- `PUT /api/cctv/[id]` - Update CCTV
- `DELETE /api/cctv/[id]` - Delete CCTV

### Absensi
- `GET /api/absensi` - Get all attendance records
- `GET /api/absensi/today` - Get today's attendance
- `POST /api/absensi` - Create attendance record

### Face Recognition
- `POST /api/face-recognition` - Process face recognition

### Setup
- `POST /api/setup-sample-data` - Create sample data

## WebSocket Events

### Client to Server
- `face-detected` - Send face detection data
- `cctv-status` - Update CCTV status

### Server to Client
- `face-recognition-result` - Face recognition result
- `attendance-update` - Real-time attendance updates
- `cctv-status-update` - CCTV status updates

## Cara Kerja Face Recognition

1. **Detection**: CCTV mendeteksi wajah seseorang
2. **Comparison**: Sistem membandingkan wajah dengan database karyawan
3. **Recognition**: Jika confidence > 0.7, wajah dianggap cocok
4. **Validation**: Cek apakah karyawan sudah absen hari ini
5. **Recording**: Jika belum, buat record absensi baru
6. **Notification**: Broadcast update ke semua client

## Security Features

- **Face Recognition Threshold**: Minimum 70% confidence
- **Duplicate Prevention**: Cek absensi harian
- **Data Validation**: Input validation di semua forms
- **Error Handling**: Comprehensive error handling

## Future Enhancements

- Integration dengan CCTV IP Camera real
- Mobile app untuk karyawan
- Laporan dan analytics
- Export data ke Excel/PDF
- Multi-location support
- Shift management
- Leave management integration

## Troubleshooting

### Common Issues
1. **Face Recognition Not Working**: Pastikan foto wajah karyawan sudah diupload
2. **CCTV Not Connected**: Cek IP, port, dan kredensial CCTV
3. **Duplicate Attendance**: Sistem otomatis mencegah duplikasi harian
4. **Slow Performance**: Optimasi database queries dan image processing

### Logs
Cek file `dev.log` untuk detailed error messages dan debugging information.