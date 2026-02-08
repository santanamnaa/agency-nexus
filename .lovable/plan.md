

# 🚀 HLM Creative Agency ERP - Full Web App

Migrasi sistem ERP PT Hita Loka Manava dari Google Sheets ke web app modern dengan design SaaS dark mode, RBAC, dan semua modul yang lebih canggih.

---

## 1. Authentication & RBAC (Role-Based Access Control)

### Login System
- Halaman login modern dengan branding HLM (violet/pink theme)
- Email + password authentication via Supabase
- Session management & auto-logout

### 3 Roles dengan Akses Berbeda
| Role | Akses |
|------|-------|
| **Super Admin** (CEO/COO) | Full CRUD semua modul, audit log viewer, user management, system settings |
| **Admin** (Accounting/Executive) | Akses modul keuangan (Laba Rugi, Neraca, Arus Kas) dan Dashboard Executive |
| **Employee** | Absensi semua karyawan, CRUD Project & Tasks (dengan activity log ke Super Admin) |

### Audit/Activity Log
- Setiap perubahan data oleh Employee tercatat: siapa, kapan, apa yang diubah, nilai lama vs baru
- Super Admin bisa lihat semua log perubahan di halaman dedicated

---

## 2. Dashboard (📊)

- **KPI Cards**: Total Revenue, Active Projects, Active Clients, Today's Attendance, Total Content
- **Monthly Revenue Chart** (bar chart dari data Laba Rugi)
- **Production Status** (donut chart)
- **Revenue by Category** (pie chart dari Active Clients)
- **Project Progress** (horizontal bar chart)
- **Attendance Overview** (top performers, today's count)
- Role-based: Admin hanya lihat finance KPIs, Employee lihat project & attendance KPIs

---

## 3. Client Database / CRM (💰)

- Tabel client dengan filter & search
- Fields: Client ID, Brand Name, PIC, Service Category, Package, Value (IDR), Start Date, Status
- Status pipeline: Lead → Proposal → Active → Completed → Lost
- Detail view per client dengan linked projects & transactions
- CRUD operations sesuai role

---

## 4. Project Production (🎬)

- Kanban board view + table view (toggle)
- Fields: Project ID, Name, Client (linked), Service Category/Type, Package, Timeline, Progress bar, Status, Project Lead, Editor
- Status flow: Briefing → Planning → In Production → Review → Revision → Final Review → Delivered → Completed
- Auto-calculate progress dari completed tasks
- Linked ke Client Database dan Production Tasks

---

## 5. Production Tasks / Content Workflow (📋)

- Task management per project dengan content production fields
- **Approval Flow System**: Draft → PL Review → AD Review → PM Review → Client Review → Final → Published
- Content fields: POEM (Organic/Endorse/Ads), Medium (Post/Reels/Story/Carousel), Pillar, Emotional angle, Title, Brief, Script, Ref, Asset, Caption
- Assignment: Editor, Videographer, Copywriter, Project Lead
- Task templates auto-generate (Social Media, Campaign, Video, Brand Development)
- Timeline tracking: Start, Due, Done dates

---

## 6. Keuangan - 3 Laporan

### 6a. Laba Rugi (Income Statement)
- Transaction log: Tanggal, No Transaksi, Client (linked), Project (linked), Kategori, Deskripsi, Pendapatan, Beban, Laba/Rugi
- Kategori: Pendapatan Jasa/Retainer/Lain, Beban Talent/Produksi/Equipment/Software/Operasional/Marketing
- Summary section dengan total & grafik trend

### 6b. Neraca (Balance Sheet)
- Layout structured: Aset Lancar, Aset Tetap, Liabilitas, Ekuitas
- Auto-link ke Laba Rugi untuk Laba Periode Berjalan
- Perbandingan Periode Ini vs Periode Lalu

### 6c. Arus Kas (Cash Flow)
- 3 section: Operasi, Investasi, Pendanaan
- Auto-calculate dari data Laba Rugi
- Summary: Kenaikan/Penurunan Kas, Saldo Awal → Saldo Akhir

---

## 7. Team Management (👥)

- Profil karyawan: EMP ID, Name, Role, Department, Join Date, Phone, Status
- Departments: Executive, Production, Strategy, Creative, Account, Business
- Performance overview per team member (projects assigned, tasks completed, attendance rate)
- Super Admin: manage team members (add/edit/deactivate)

---

## 8. Service Catalog (📦)

- Katalog lengkap layanan HLM dengan 3 tier pricing (Essentials, Signature, Prime)
- Kategori: Social Media Activation, Data Insight, IP Development, Photo & Video Production
- HPP (cost) per service untuk profit calculation
- Linked ke Project dan CRM saat create new deal

---

## 9. Attendance / Absensi (⏰)

- **Check-in system**: Tombol check-in dengan auto-record waktu
- Status: Hadir, WFH, Sakit, Cuti, Izin, Alpa
- **Semua Employee bisa lihat** attendance sesama karyawan (transparansi)
- Monthly summary per karyawan
- Statistics & charts: attendance rate, most active, monthly recap
- Super Admin: bisa edit/override attendance records

---

## 10. Notifikasi & WhatsApp Integration

- **In-app notifications**: Approval pending, deadline reminder, task assignment
- **WhatsApp links**: Quick action buttons untuk kirim update ke team via WA (seperti di spreadsheet)
- Notification center di navbar

---

## 11. Data Migration

- Import tool untuk migrasi data dari spreadsheet existing
- Support CSV upload untuk: Clients, Projects, Tasks, Finance transactions, Team, Attendance
- Validation & mapping sebelum import

---

## 12. Fitur Tambahan (Upgrade dari Spreadsheet)

- **Global Search**: Cari apapun (client, project, task) dari satu search bar
- **Dark/Light Mode** toggle (default dark untuk SaaS feel)
- **Responsive Design**: Bisa diakses dari mobile untuk check-in & quick view
- **Export to PDF/Excel**: Laporan keuangan bisa di-export
- **User Settings**: Profile, change password, notification preferences

---

## Tech Stack & Architecture

- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database, Auth, Edge Functions, Storage)
- **Charts**: Recharts (sudah terinstall)
- **Design**: Modern SaaS style, dark mode support, violet/pink accent (sesuai branding HLM)

