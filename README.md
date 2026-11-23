# LUXMONITOR // ESP32 - Monitoring Pencahayaan 3

Website Dashboard Responsive untuk Sistem Monitoring Intensitas Pencahayaan Realtime berbasis **Next.js**, **ESP32**, sensor **BH1750 (I2C)**, dan **Firebase Realtime Database** sesuai pedoman kenyamanan pencahayaan **SNI 03-6197**.

---

## 🌟 Fitur Utama

1. **Koneksi Realtime Firebase RTDB**:
   - Sinkronisasi instan dua arah melalui **Server-Sent Events (SSE)** & REST API Firebase.
   - Deteksi status koneksi hardware (**ONLINE / OFFLINE**) dan indikator jitter latency (ping).
   - Tombol toggle **Live Sync** untuk mengontrol aliran data streaming langsung dari ESP32.

2. **Realtime Lux & Condition Hero Banner (Data Terkini: 902 Lux / Terang (Terlalu Terang))**:
   - Display metrik lux berukuran besar dengan *amber luminous glow*.
   - Evaluasi ambien otomatis berdasarkan standar **SNI 03-6197**:
     - **Terang (Terlalu Terang) / BERLEBIHAN (>750 Lux)**: Silau, disarankan meredupkan dimmer/tirai.
     - **CUKUP TERANG (500 - 750 Lux)**: Terang Nyaman.
     - **IDEAL (150 - 500 Lux)**: Standar SNI Ruang Tamu Terpenuhi.
     - **REDUP (<150 Lux)**: Kurang Terang.
   - Bar meter spektrum warna (0 - 1.200 lx) dengan jarum indikator dinamis.
   - Statistik sesi langsung: Jam lokal WIB, Akurasi Sensor (±20% LX), Min/Maks Lux, dan Rata-rata sesi.

3. **Chart History Data Interaktif**:
   - Kurva telemetri dengan efek *ambient gradient glow*.
   - Garis ambang batas kenyamanan (**150 - 500 lx**) & ambang batas silau (**>750 lx**).
   - Pilihan rentang waktu interaktif: **1 Jam**, **6 Jam**, **24 Jam**, dan **7 Hari**.
   - Indikator nilai puncak otomatis (*Peak Value & Time*).

4. **Tabel Riwayat Telemetri & Filter Cerdas**:
   - Pencarian teks instan (berdasarkan Node Key, Kondisi, atau Nilai Lux).
   - Filter cepat rentang tanggal (*Hari Ini*, *24 Jam*, *7 Hari*, *Semua*) serta pemilih tanggal kustom (*Dari — Sampai*).
   - Ekspor data hasil filter ke file **CSV** dengan 1 klik.
   - Paginasi responsif dan penanda baris realtime terbaru dengan animasi radar ping.

---

## ⚙️ Kredensial Firebase

```env
NEXT_PUBLIC_FIREBASE_HOST=akuisisi-data-sensor-esp32-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_AUTH=Bq9VruxnrWFa1cs9j1m5ivqH4qRXjI3PP8NSv4NU
NEXT_PUBLIC_FIREBASE_PATH=historyDataCahaya
```

Contoh Record Push Terbaru di Database:
- Node: `-P64cdAf-REbQoqxi3sP`
- `value`: `902`
- `condition`: `"Terang (Terlalu Terang)"`
- `timestamp`: `1794317128427`

---

## 🚀 Cara Menjalankan

### Cara 1: Menggunakan Node.js Server Instan
Jalankan file server bawaan di terminal:
```bash
node server.js
```
Lalu buka di browser: `http://localhost:3000`

### Cara 2: Membuka Langsung File HTML
Klik ganda file [`index.html`](file:///c:/Users/user/Documents/Monotoring%20Pencahayan.3/index.html) langsung di Google Chrome atau Microsoft Edge.

### Cara 3: Menjalankan Proyek Next.js
```bash
npm.cmd install
npm.cmd run dev
```
Buka browser di `http://localhost:3000`.

