const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // ví dụ: "lms-BinaryBandits.com"
});

const bucket = admin.storage().bucket();

module.exports = bucket;
