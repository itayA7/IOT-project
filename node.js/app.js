// Importing necessary modules and dependencies
const { auth, db } = require("./configFirebase"); // Import Firebase configuration for authentication and database
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth"); // Import authentication methods
const { ref, set, get, child, push, query, equalTo } = require("firebase/database"); // Import database methods
const express = require("express"); // Import Express.js framework for creating server-side applications
const bodyParser = require("body-parser"); // Middleware for parsing request bodies
const cors = require("cors"); // Middleware for enabling Cross-Origin Resource Sharing
const { spawn } = require('child_process'); // Module for executing external processes, used to run Python scripts

// Initialize Express app
const app = express();
const port = 8080;

// Middleware setup
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors({ origin: "*" })); // Enable CORS for all origins

// Route for handling user login
app.post("/login_form", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  login(email, password, res);
});

// Route for handling user registration
app.post("/register_form", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const age = req.body.age;
  signUp(res, email, password, name, age);
});

// Route for fetching ESPCam IP address
app.get("/espcam", async (req, res) => {
  try {
    const ip = await getEspCamIP();
    console.log("ESPCAM IP:" + ip);
    res.status(200).json({ status: "success", ip: ip });
  } catch (error) {
    const errorCode = error.code || "unknown";
    res.status(401).json({ status: "failed", message: errorCode });
  }
});

// Route for running Python script with input data
app.post("/espcam/dtw", async (req, res) => {
  try {
    const keypointsInput = req.body.keypoints;
    const excNumberInput = req.body.exeNum;
    const result = await runPythonScript(keypointsInput, excNumberInput);
    res.status(200).json({ status: "success", result: result });
  } catch (error) {
    const errorCode = error || "unknown";
    res.status(401).json({ status: "failed", message: errorCode });
  }
});

// Route for saving user session history to the database
app.post("/espcam/saveHistory", async (req, res) => {
  try {
    const uid = req.body.userId;
    const data_of_session = req.body.data;
    const excNumber=req.body.exc;
    writeSessionToHistory(uid, data_of_session,excNumber);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error)
    const errorCode = error || "unknown";
    res.status(401).json({ status: "failed", message: errorCode })
  }
});

// Route for retrieving user session history from the database
app.post("/espcam/getUserHistory", async (req, res) => {
  const uid = req.body.userId;
  const userHistory = await getHistoryByUserId(uid);
  res.status(200).json({ userHistory: userHistory });
});

// Server initialization
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Function for user login
async function login(email, password, res) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;
    const userDbData = await getUserDataFromDatabase(uid);
    res.status(200).json({ status: "success", uid: uid, user: userDbData });
  } catch (error) {
    console.log(error.code);
    res.status(500).json({ status: "failed", message: error.code });
  }
}

// Function for user registration
async function signUp(res, email, password, name, age) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    writeUserData(uid, email, name, age);
    res.status(200).json({ status: "success", message: "User registered successfully!" });
  } catch (error) {
    const errorCode = error.code || "unknown";
    res.status(401).json({ status: "failed", message: errorCode });
  }
}

// Function for writing user data to the database upon registration
function writeUserData(userId, email, name, age) {
  set(ref(db, "users/" + userId), {
    username: name,
    email: email,
    age: age,
  });
  console.log("user added successfully");
}

// Function for writing user session history to the database
function writeSessionToHistory(userId, data,excNumber) {
  const date = new Date();
  const currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const postListRef = ref(db, 'history/');
  const newPostRef = push(postListRef);
  set(newPostRef, {
    date: currentDate,
    exercise:excNumber,
    not_accurate_parts: data,
    uid: userId
  });
  console.log("history added successfully")
}

// Function for retrieving user session history from the database
async function getHistoryByUserId(userId) {
  const historyRef = ref(db, 'history/');
  const snapshot = await get(historyRef);
  const userHistory = [];
  snapshot.forEach((childSnapshot) => {
    const historyData = childSnapshot.val();
    // Check if this history record belongs to the user
    if (historyData.uid === userId) {
      userHistory.push(historyData);
    }
  });
  if (userHistory.length === 0) {
    console.log('No history found for the user');
    userHistory = null;
  }
  return userHistory;
}

// Function for retrieving user data from the database
async function getUserDataFromDatabase(userId) {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${userId}`));
    if (snapshot.exists()) {
      const userDbData = snapshot.val();
      return userDbData;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function for retrieving ESPCam IP address from the database
async function getEspCamIP() {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `espcam/ip`));
    if (snapshot.exists()) {
      const ipData = snapshot.val();
      return ipData;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function for executing a Python script asynchronously
async function runPythonScript(jsonData, excNumber) {
  return new Promise((resolve, reject) => {
    // Spawn a child process to run the Python script
    const pythonProcess = spawn('C:/Users/itaya/AppData/Local/Programs/Python/Python310/python.exe', ['../python ml/DTWNode.py', excNumber]);
    let result;
    // Handle output from the Python script
    pythonProcess.stdout.on('data', (data) => {
      result = JSON.parse(data.toString());
      console.log('Received from Python:', result);
    });
    // Handle errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python: ${data}`);
      reject("Server Error");
    });
    // Handle the Python process closing
    pythonProcess.on('close', (code) => {
      console.log("Python process ended with code:", code);
      resolve(result);
    });
    // Send JSON data to the Python script
    pythonProcess.stdin.write(JSON.stringify(jsonData));
    pythonProcess.stdin.end();
  });
}
