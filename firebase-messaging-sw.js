importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyClfmtSduoS8ymewz5ATOJ1yzgFwWj8cFU",
  authDomain: "pak-poultry-bussiness.firebaseapp.com",
  projectId: "pak-poultry-bussiness",
  storageBucket: "pak-poultry-bussiness.firebasestorage.app",
  messagingSenderId: "833466552491",
  appId: "1:833466552491:web:90aa44675e4867e79d67ee"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});