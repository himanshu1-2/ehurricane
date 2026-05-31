const admin = require('firebase-admin');

let initialized = false;

const initFirebase = () => {
  if (initialized) return admin;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  //console.log(raw)

  if (!raw) {
    console.warn('[firebase] FIREBASE_SERVICE_ACCOUNT_JSON is not set; push notifications disabled.');
    return null;
  }

  try {
    const serviceAccount = raw
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    initialized = true;
    return admin;
  } catch (err) {
    console.error('[firebase] Failed to initialize:', err.message);
    return null;
  }
};

module.exports = { admin, initFirebase };
