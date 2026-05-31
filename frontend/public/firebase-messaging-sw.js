importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCeHEJ1VbCWqgRkReNBZOmXi1ht_0ZdCj0",
  authDomain: "tiffian-mangement.firebaseapp.com",
  projectId: "tiffian-mangement",
  storageBucket: "tiffian-mangement.appspot.com",
  messagingSenderId: "60178803849",
  appId: "1:60178803849:web:b2901cc1733446b533ea58",
});

firebase.messaging();