const admin = require("firebase-admin");

const serviceAccount = require("./firebase-keys.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app();
}
export const firestore = admin.firestore();
