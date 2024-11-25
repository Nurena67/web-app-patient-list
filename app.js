const express = require('express');
const app = express();
const port = 3000;
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const { 
  readPatients, 
  findPatient,
  writePatients, 
  generateNewId,
  savePatient } = require('./utils/patients');
  const fs = require('fs');
  

// Middleware
app.use(expressLayout);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Melayani file statis
app.set('view engine', 'ejs'); // Set EJS sebagai template engine
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

//homepage
app.get('/', (req, res) => {
  res.render('index', {
    title : 'HOME',
    layout : 'partials/main-layout'});
});

app.get('/about', (req, res) => {
  res.render('about', {
    title : 'Halaman About',
    layout : 'partials/main-layout'
  });
});


app.get('/patients', (req, res) => {
  const patients = readPatients();
  
  res.render('patients', {
    title : 'Halaman Data Patients',
    layout : 'partials/main-layout',
    patients
  });
});

// Halaman form tambah
app.get('/patients/create/new', (req, res) => {
  res.render('patient-create', {
    title : 'Form Tambah Pasien',
    layout : 'partials/main-layout'
  });
});

app.post('/patient-create', (req, res) => {
  const patients = readPatients();
  const newPatient = {
    id: generateNewId(),
    nama: req.body.nama,
    umur: parseInt(req.body.umur),
    blood: req.body.blood,
    checkup: req.body.checkup,
    family: req.body.family,
    keluhan: req.body.keluhan,
  };
  patients.push(newPatient);
  writePatients(patients);
  res.redirect('/patients');
});


app.get('/patients/:id', (req, res) => {
  const id = req.params.id; // Ambil ID
  const patient = findPatient(id); // Cari data pasien

  if (!patient) {
    return res.status(404).send('Pasien tidak ditemukan');
  }
  res.render('detail', {
    title: 'Detail Data Patients',
    layout: 'partials/main-layout',
    patient
  });
});


app.get('/patients/:id/edit', (req, res) => {
  const id = req.params.id;
  const patient = findPatient(id); // Menemukan pasien berdasarkan ID

  if (!patient) {
    return res.status(404).send('Pasien tidak ditemukan');
  }

  res.render('patient-edit', { // Render form edit
    title: 'Edit Data Pasien',
    layout: 'partials/main-layout',
    patient
  });
});

app.post('/patients/:id/edit', (req, res) => {
  const id = req.params.id; // Ambil ID pasien dari URL
  const { nama, umur, keluhan, checkup, blood, family } = req.body; // Ambil data dari form

  // Temukan pasien berdasarkan ID
  let patient = findPatient(id);
  if (!patient) {
    return res.status(404).send('Pasien tidak ditemukan');
  }

  // Update data pasien
  patient = { 
    id: id, 
    nama: nama, 
    umur: umur, 
    keluhan: keluhan, 
    checkup: checkup, 
    blood: blood, 
    family: family 
  };

  // Simpan perubahan data pasien (misalnya di file JSON atau database)
  savePatient(patient);

  // Redirect ke halaman detail pasien setelah data diperbarui
  res.redirect(`/patients/${id}`);
});

app.post('/patients/:id/delete', (req, res) => {
  const id = req.params.id;

  let patients = readPatients();
  const updatedPatients = patients.filter(patient => patient.id !== id); // Hapus pasien berdasarkan ID

  if (patients.length === updatedPatients.length) {
    return res.status(404).send('Pasien tidak ditemukan');
  }

  fs.writeFileSync('./data/patients.json', JSON.stringify(updatedPatients, null, 2)); // Simpan perubahan ke file JSON

  res.redirect('/patients'); // Redirect ke halaman daftar pasien setelah penghapusan
});



app.listen(port, () => {
  console.log(`App Listening at http:localhost:${port}`);
});