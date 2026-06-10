# NeoCare - Doctor Booking App

NeoCare adalah aplikasi booking dokter berbasis web yang dibuat menggunakan MERN Stack. Aplikasi ini memungkinkan pasien untuk mencari dokter, membuat appointment, melihat riwayat appointment, serta menerima notifikasi. Selain itu, dokter dapat mengelola appointment pasien, sedangkan admin dapat mengelola data user, dokter, dan appointment.

## Fitur Utama

### Guest

* Melihat daftar dokter yang tersedia.
* Melihat detail dokter.
* Jika ingin melakukan booking, guest akan diarahkan ke halaman register.

### User / Pasien

* Register dan login akun.
* Melihat daftar dokter.
* Melihat detail dokter.
* Booking appointment dengan dokter.
* Mengunggah dokumen pendukung saat booking.
* Melihat riwayat appointment.
* Menerima notifikasi terkait status appointment.
* Mengajukan diri menjadi dokter.

### Doctor

* Login sebagai dokter setelah disetujui admin.
* Melihat appointment dari pasien.
* Approve atau reject appointment.
* Melihat dan mengubah profil dokter.
* Menerima notifikasi appointment baru.

### Admin

* Melihat dashboard admin.
* Mengelola data user.
* Mengelola pengajuan dokter.
* Approve atau reject dokter.
* Mengelola seluruh appointment.
* Membatalkan appointment jika diperlukan.
* Menerima notifikasi pengajuan dokter dan appointment baru.

## Teknologi yang Digunakan

### Frontend

* React.js
* Vite
* React Router DOM
* Bootstrap
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer

## Struktur Project

```txt
doctor-booking-app/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── dashboard/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/username/nama-repository.git
cd nama-repository
```

### 2. Install Dependency Backend

```bash
cd server
npm install
```

### 3. Buat File `.env` di Folder Server

Buat file `.env` di dalam folder `server`, lalu isi seperti berikut:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/doctor-booking-app
JWT_SECRET=your_jwt_secret_key
```

Sesuaikan `MONGO_URI` jika menggunakan MongoDB Atlas.

### 4. Jalankan Backend

```bash
npm run dev
```

Backend akan berjalan di:

```txt
http://localhost:5000
```

### 5. Install Dependency Frontend

Buka terminal baru, lalu jalankan:

```bash
cd client
npm install
```

### 6. Jalankan Frontend

```bash
npm run dev
```

Frontend akan berjalan di:

```txt
http://localhost:5173
```

## Role Pengguna

Aplikasi ini memiliki tiga role utama:

| Role   | Hak Akses                                                                   |
| ------ | --------------------------------------------------------------------------- |
| User   | Booking dokter, melihat riwayat appointment, mengajukan diri menjadi dokter |
| Doctor | Mengelola appointment pasien dan mengubah profil dokter                     |
| Admin  | Mengelola user, dokter, dan appointment                                     |

## Alur Booking Appointment

1. User login sebagai pasien.
2. User memilih dokter dari daftar dokter.
3. User melihat detail dokter.
4. User mengisi form booking appointment.
5. Appointment masuk dengan status `pending`.
6. Dokter dapat menyetujui atau menolak appointment.
7. User akan menerima notifikasi setelah appointment diproses.

## Status Appointment

| Status    | Keterangan                              |
| --------- | --------------------------------------- |
| Pending   | Appointment menunggu persetujuan dokter |
| Approved  | Appointment disetujui dokter            |
| Rejected  | Appointment ditolak dokter              |
| Cancelled | Appointment dibatalkan admin            |

## Notifikasi

Sistem notifikasi digunakan untuk memberi informasi kepada user, dokter, dan admin. Setiap notifikasi baru akan menampilkan angka pada icon lonceng. Setelah halaman notifikasi dibuka, angka notifikasi akan hilang, tetapi isi notifikasi tetap tersimpan.

## Upload Dokumen

User dapat mengunggah dokumen pendukung saat membuat appointment, seperti hasil pemeriksaan, resep, atau dokumen kesehatan lainnya. File yang diunggah akan disimpan di folder `server/uploads`.

## Catatan Pengembangan

Project ini masih dapat dikembangkan lebih lanjut, seperti:

* Menambahkan fitur chat antara pasien dan dokter.
* Menambahkan fitur pembayaran.
* Menambahkan jadwal dokter yang lebih detail.
* Menambahkan fitur rating dan review dokter.
* Menambahkan dashboard statistik yang lebih lengkap.

## Developer

Project ini dibuat sebagai aplikasi web booking dokter berbasis MERN Stack.
