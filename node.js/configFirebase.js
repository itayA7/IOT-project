const { initializeApp } = require("firebase/app"); // Importing the initializeApp function from the firebase/app module.
const { getAuth } = require("firebase/auth"); // Importing the getAuth function from the firebase/auth module.
const { getDatabase } = require("firebase/database"); // Importing the getDatabase function from the firebase/database module.

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpaInX5PJl8xVU_m8wmqvW4aOvqrBxuG0", // Firebase API key.
  authDomain: "iot-final-june2023.firebaseapp.com", // Firebase authentication domain.
  databaseURL: "https://iot-final-june2023-default-rtdb.europe-west1.firebasedatabase.app", // Firebase database URL.
  projectId: "iot-final-june2023", // Firebase project ID.
  storageBucket: "iot-final-june2023.appspot.com", // Firebase storage bucket.
  messagingSenderId: "754993571905", // Firebase messaging sender ID.
  appId: "1:754993571905:web:3b45b0b1a94a10e0187ec0", // Firebase app ID.
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig); // Initializing the Firebase app with the provided configuration.
const auth = getAuth(firebaseApp); // Initializing Firebase Authentication with the initialized app.
const db = getDatabase(); // Initializing Firebase Realtime Database.

module.exports = { auth, db }; // Exporting Firebase Authentication and Firebase Realtime Database instances.
