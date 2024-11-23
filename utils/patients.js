const fs = require('fs');

const dirPath = './data';
const dataPath = `${dirPath}/patients.json`;
const idPath = `${dirPath}/lastId.json`;

// Fungsi untuk mendapatkan ID terakhir
const getLastId = () => {
  if (fs.existsSync(idPath)) {
    const data = JSON.parse(fs.readFileSync(idPath, 'utf-8'));
    return data.lastId;
  }
  return 1000; // ID awal jika file belum ada
};
// Fungsi untuk menyimpan ID terakhir
const saveLastId = (newId) => {
  fs.writeFileSync(idPath, JSON.stringify({ lastId: newId }, null, 2));
};
// Fungsi untuk menghasilkan ID baru (4 digit)
const generateNewId = () => {
  const lastId = getLastId();
  const newId = lastId + 1;
  saveLastId(newId);
  return newId.toString().padStart(4, '0'); // Format ID menjadi 4 digit
};


const initializeData = () => {
    if(!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    if(!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '[]', 'utf-8');
};

// Fungsi untuk membaca data pasien
const readPatients = () => {
  if (fs.existsSync(dataPath)) {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }
  return []; // Jika file belum ada, kembalikan array kosong
};

// Fungsi untuk mencari pasien berdasarkan ID
const findPatient = (id) => {
  const patients = readPatients();
  const idStr = id.toString();
  return patients.find(p => p.id === idStr);
};

// Fungsi untuk menulis data pasien
const writePatients = (patients) => {
  fs.writeFileSync(dataPath, JSON.stringify(patients, null, 2));
};

// Fungsi untuk menyimpan data pasien (misalnya ke file JSON)
function savePatient(updatedPatient) {
  let patients = readPatients(); // Memuat data pasien yang ada
  const index = patients.findIndex(patient => patient.id === updatedPatient.id);
  if (index !== -1) {
    patients[index] = updatedPatient; // Ganti data pasien yang lama
    fs.writeFileSync('./data/patients.json', JSON.stringify(patients, null, 2)); // Simpan ke file JSON
  }
}
  
  module.exports = {
    initializeData,
    readPatients,
    writePatients,
    findPatient,
    generateNewId,
    savePatient
  };