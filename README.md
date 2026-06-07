🚀 TalentHub - KOL Ratecard Finder
Platform web internal full-stack monolith yang dirancang khusus untuk mencari, menyaring, dan mengelola data ratecard Influencer / KOL (Key Opinion Leader) secara efisien.

🛠️ Fitur Utama
KOL Search & Filter: Mempermudah pencarian Influencer berdasarkan nama, platform (Instagram/TikTok), jumlah followers, kategori niche, dan rentang harga ratecard.

Ratecard Management (CRUD): Fitur untuk menambah, mengubah, dan menghapus database ratecard KOL terbaru ke dalam sistem.

Single User Authentication: Sistem login terpusat menggunakan next-auth di mana hak akses hanya diberikan kepada 1 User Utama (ADMIN) untuk menjaga keamanan data internal perusahaan.

💻 Tech Stack & Arsitektur
Frontend: Next.js (App Router), React, TypeScript.
Styling: Tailwind CSS.
Backend & Database: Node.js (Next API Routes), PostgreSQL, dan Prisma ORM.
Security: NextAuth.js (Credentials Provider).

⚙️ Persiapan Environment
Buat file .env di root project dan isi konfigurasinya seperti ini:
# Koneksi ke database PostgreSQL lokal kamu
DATABASE_URL="postgresql://postgres:password@localhost:5432/talenthub_ratecard"

# Secret token untuk mengamankan session login Admin
AUTH_SECRET="isi-dengan-string-random-bebas"

🚀 Jalankan Aplikasi di Laptop Tim
Minta tim kamu untuk membuka Terminal di VS Code, lalu jalankan perintah ini secara berurutan:
# 1. Install semua library pendukung
npm install
# 2. Sinkronisasi struktur tabel ratecard ke PostgreSQL lokal
npx prisma migrate dev --name init_talenthub
# 3. Jalankan server lokal untuk mulai koding frontend/backend
npm run dev

Web otomatis bisa diakses di browser pada alamat http://localhost:3000.

📂 Struktur Modul Projek
📂 app/ : Mengatur rute halaman tampilan web dan endpoint API backend.
📂 components/ : Tempat kodingan potongan UI (Form login, tabel data KOL, dan komponen search bar).
📂 lib/ : Berisi script logika query database Prisma untuk mengambil atau menyimpan data KOL.
📂 prisma/ : Berisi file schema.prisma yang mendefinisikan tabel data KOL dan Admin.
