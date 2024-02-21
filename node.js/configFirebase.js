const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const {getDatabase}=require("firebase/database");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpaInX5PJl8xVU_m8wmqvW4aOvqrBxuG0",
  authDomain: "iot-final-june2023.firebaseapp.com",
  databaseURL:
    "https://iot-final-june2023-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "iot-final-june2023",
  storageBucket: "iot-final-june2023.appspot.com",
  messagingSenderId: "754993571905",
  appId: "1:754993571905:web:3b45b0b1a94a10e0187ec0",
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);//הגדרת firebase Authentication
const db=getDatabase();
module.exports = { auth,db };
