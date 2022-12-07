importScripts("https://www.gstatic.com/firebasejs/9.9.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.9.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDoEY2A1b7CRN-yUhOUvBrSAlVScMnQ1sk",
    authDomain: "smart-coach-prod.firebaseapp.com",
    projectId: "smart-coach-prod",
    storageBucket: "smart-coach-prod.appspot.com",
    messagingSenderId: "141452031913",
    appId: "1:141452031913:web:7365eb91538dbee287f6b8",
    measurementId: "G-DDM431GDY6",
    vapidKey: "BFYwNi1GQ2ms77OnKfQJxFM1dicq0NkJ3taVfLCZrYoGlr9_jsIS2722Ljb9AS-dCmEJw-R46QzCm8ZIIlWmPv8"
});
const messaging = firebase.messaging();
