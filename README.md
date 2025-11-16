# ⏱️ Time Tracker Application  
Aplikasi Time Tracker berbasis web yang dikembangkan menggunakan **Ruby on Rails** sebagai bagian dari proyek PKL di PT Kharisma Indotech Pratama.  
Aplikasi ini dirancang untuk membantu perusahaan mengelola waktu kerja pegawai secara lebih efisien melalui fitur pencatatan waktu, manajemen proyek, dan manajemen tugas.

---

## 🚀 Fitur Utama

### 👤 **Autentikasi & Otorisasi**
- Login & Register (email, username, password)
- Hak akses berbasis role:
  - **Admin** → mengelola proyek, tugas, dan anggota
  - **Pegawai** → mencatat waktu tugas (log task)

### 📁 **Manajemen Proyek (Admin)**
- Tambah, edit, dan hapus proyek
- Menambahkan tugas ke dalam tiap proyek
- Menambahkan dan menghapus member proyek

### 📝 **Manajemen Tugas**
- Pembuatan task per proyek
- Task terhubung langsung ke pegawai terkait

### ⏲️ **Time Tracking (Pegawai)**
- Membuat Log Task (catatan waktu)
- Menjalankan timer countdown
- Mengedit dan menghapus log task
- Melihat total waktu mingguan
- Navigasi antar minggu

### ⚡ **Interaktivitas**
- Menggunakan **Hotwire** (Turbo + StimulusJS)
- Update halaman cepat tanpa reload penuh
- Antarmuka responsif menggunakan **Bootstrap 5**

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Fungsi |
|----------|--------|
| **Ruby on Rails** | Back-end, routing, MVC, ActiveRecord |
| **ERB Template** | Rendering HTML dinamis |
| **SQLite3** | Database pengembangan |
| **Bootstrap 5** | UI responsif |
| **Hotwire (Turbo & StimulusJS)** | Interaktivitas tanpa JS yang kompleks |
| **GitHub** | Version control |
| **Visual Studio Code** | Development editor |

---

## 📦 Struktur Fitur

### Untuk **Admin**
- CRUD Proyek  
- CRUD Tugas  
- Penambahan anggota proyek  
- Melihat daftar proyek dan tugas  

### Untuk **Pegawai**
- Membuat log task  
- Menjalankan & menghentikan timer  
- Edit & delete log task  
- Melihat histori waktu mingguan  

---

## 🗄️ Arsitektur MVC
Aplikasi dibangun dengan pola **Model–View–Controller** standar Ruby on Rails:

- **Model** → User, Project, ProjectMember, Task, LogTask  
- **View** → ERB templates + Bootstrap  
- **Controller** → Mengatur logika aplikasi & komunikasi antara model dan view  

---

## 🔧 Cara Menjalankan Aplikasi

### **1. Clone Repository**
```bash
git clone https://github.com/USERNAME/NAMA_REPO.git
cd NAMA_REPO
```
### **2. Install Dependencies**
```bash
bundle install
``` 
### **3. Setup Database**
```bash
rails db:create
rails db:migrate
```
### **4. Jalankan Server**
```bash
rails server
```
## 📘 Cara Menggunakan Aplikasi

### 🛠️ Admin
1. Login sebagai admin  
2. Buat proyek baru  
3. Tambahkan tugas ke proyek  
4. Tambahkan member ke dalam proyek  
5. Lihat, edit, atau hapus proyek  

### 👤 Pegawai
1. Login ke aplikasi  
2. Buka halaman **Log Task**  
3. Tambahkan log waktu atau mulai timer  
4. Hentikan timer ketika tugas selesai  
5. Lihat total waktu per minggu melalui dashboard  

---

## 📚 ERD (Entity Relationship Diagram)

Aplikasi memiliki hubungan antar data sebagai berikut:

- **User** —< **Project** (setiap proyek memiliki owner)  
- **Project** —< **Task** (satu proyek terdiri dari banyak tugas)  
- **Project** >—< **User** (melalui **ProjectMember**, relasi many-to-many)  
- **Task** —< **LogTask** (tiap tugas dapat memiliki banyak catatan waktu)  
- **User** —< **LogTask** (tiap pengguna dapat mencatat banyak waktu)  

Diagram ini membentuk struktur utama hubungan data pada aplikasi Time Tracker.


---

## ✨ Pengembang

**Egi Satria Dharma Yudha Wicaksana**  
Full-Stack Developer  
Teknologi: *Ruby on Rails, ERB, Bootstrap 5, Hotwire (Turbo & Stimulus)*


## 📄 Lisensi

Aplikasi ini dikembangkan sebagai bagian dari kegiatan **Praktik Kerja Lapangan (PKL)** di  
**PT Kharisma Indotech Pratama**.  
Aplikasi ini tidak diperbolehkan untuk penggunaan komersial tanpa izin resmi dari perusahaan.
