const express = require('express');
const client = require('prom-client'); 
const app = express();
const port = 3000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const counter = new client.Counter({
  name: 'jumlah_request_total',
  help: 'Menghitung total request yang masuk ke aplikasi anggota',
  labelNames: ['nama_anggota']
});

app.get('/', (req, res) => {
  counter.inc({ nama_anggota: 'Dico' });
  res.send('<h1>Aplikasi Anggota Kelompok 5 Berhasil Jalan!</h1>');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => {
  console.log(`Aplikasi jalan di http://localhost:${port}`);
  console.log(`Data metrik ada di http://localhost:${port}/metrics`);
});
