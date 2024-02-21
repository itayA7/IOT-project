const { auth, db } = require("./configFirebase"); // get the firebase app and auth from configFirebase.js file
const {signInWithEmailAndPassword,createUserWithEmailAndPassword} = require("firebase/auth");
const { ref, set, get, child } = require("firebase/database");
const express = require("express"); //import ndoe express
const bodyParser = require("body-parser"); // Import body-parser
const cors = require("cors");
const { spawn } = require('child_process');


const app = express();
const port = 8080;
app.use(bodyParser.json());
app.use(cors({
    origin: "*",})
);



app.post("/login_form", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  login(email, password, res);
});

app.post("/register_form", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const age = req.body.age;
  signUp(res, email, password, name, age);
});


app.get("/espcam",async (req,res)=>{
  try{
    const ip=await getEspCamIP();
    console.log("ESPCAM IP:"+ip);
    res.status(200).json({ status: "success", ip:ip });
  }
  catch (error) {
    const errorCode = error.code || "unknown";
    res.status(401).json({ status: "failed", message: errorCode });
  }
});



const fs = require('fs');

app.post("/espcam/dtw",async (req,res)=>{
  try{
    const keypointsInput=req.body.keypoints;
    const excNumberInput=req.body.exeNum;
    const result=await runPythonScript(keypointsInput,excNumberInput);
    console.log(result);
3  }
  catch(error){
    const errorCode = error || "unknown";
    res.status(401).json({ status: "failed", message: errorCode });
  }
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});




async function login(email, password, res) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth,email,password);
    const user = userCredential.user;
    const uid = user.uid;
    const userDbData = await getUserDataFromDatabase(uid);
    res.status(200).json({ status: "success", uid: uid, user: userDbData });
  } catch (error) {
    console.log(error.code);
    res.status(500).json({ status: "failed", message: error.code });
  }
}


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

function writeUserData(userId, email, name, age) {
  set(ref(db, "users/" + userId), {
    username: name,
    email: email,
    age: age,
  });
  console.log("user add succesfuly");
}

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

async function getEspCamIP(){
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


process.env.PYTHONUNBUFFERED=1;
async function runPythonScript(jsonData, excNumber) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('C:/Users/itaya/AppData/Local/Programs/Python/Python310/python.exe', ['../python ml/testsNode.py', excNumber]);
    let result;
    pythonProcess.stdout.on('data', (data) => {
      result = JSON.parse(data.toString());
      console.log('Received from Python:', result);
    });
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python: ${data}`);
      reject("Server Error");
    });
    pythonProcess.on('close', (code) => {
      console.log("Python process ended with code:", code);
      resolve(result);
    });
    pythonProcess.stdin.write(JSON.stringify(jsonData));
    pythonProcess.stdin.end();
  });
}



