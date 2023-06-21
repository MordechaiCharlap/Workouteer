const admin = require("firebase-admin");

const db = admin.firestore();
const bucket = admin.storage().bucket();
module.exports = { db, bucket };
