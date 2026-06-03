import firebase from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
//console.log('firebaseConfig', firebaseConfig)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const messaging = firebase.messaging.isSupported()
  ? firebase.messaging()
  : null;

export const getToken = async () => {
  if (!messaging) {
    console.log("Messaging not supported");
    return null;
  }

  try {
     if (!messaging) {
    throw new Error("Firebase Messaging not supported");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission denied");
  }

  // Register SW
  await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  // Wait until active
  await navigator.serviceWorker.ready;

  const token = await messaging.getToken({
    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
  });

  return token;
  } catch (error) {
    console.error("FCM Error:", error);
    throw error;
  }
};