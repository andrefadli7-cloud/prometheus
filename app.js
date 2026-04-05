const express = require('express');
const client = require('prom-client'); // Library untuk metrik
const app = express();
const port = 3000;

// 1. Setup pencatatan metrik otomatis (CPU, RAM, dll)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// 2. Custom metrik: Menghitung jumlah klik/request
const counter = new client.Counter({
  name: 'jumlah_request_total',
  help: 'Menghitung total request yang masuk ke aplikasi anggota',
  labelNames: ['nama_anggota']
});

app.get('/', (req, res) => {
  // Setiap ada yang akses, angka counter bertambah
  counter.inc({ nama_anggota: 'Dico' }); // Ganti dengan nama kalian
  res.send('<h1>Aplikasi Anggota Kelompok 5 Berhasil Jalan!</h1>');
});

// 3. ENDPOINT WAJIB: Jalur untuk si Server mengambil data
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => {
  console.log(`Aplikasi jalan di http://localhost:${port}`);
  console.log(`Data metrik ada di http://localhost:${port}/metrics`);
});