const { initializeApp } = require("firebase/app"); // Importing the initializeApp function from the firebase/app module.
const { getAuth } = require("firebase/auth"); // Importing the getAuth function from the firebase/auth module.
const { getDatabase } = require("firebase/database"); // Importing the getDatabase function from the firebase/database module.

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "", // Firebase API key.
  authDomain: "", // Firebase authentication domain.
  databaseURL: "", // Firebase database URL.
  projectId: "", // Firebase project ID.
  storageBucket: "", // Firebase storage bucket.
  messagingSenderId: "", // Firebase messaging sender ID.
  appId: "", // Firebase app ID.
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig); // Initializing the Firebase app with the provided configuration.
const auth = getAuth(firebaseApp); // Initializing Firebase Authentication with the initialized app.
const db = getDatabase(); // Initializing Firebase Realtime Database.

module.exports = { auth, db }; // Exporting Firebase Authentication and Firebase Realtime Database instances.
