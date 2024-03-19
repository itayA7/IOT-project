imageElement = document.getElementById('cam-stream');
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
var audioElement = document.getElementById('audio');

var maxWaitTime = 3500; 
var frame = 0;
var poses = [];
var flipHorizontal = true;
//keypoints index to part
//0:'nose', 1:'leftEye', 2:'rightEye', 3:'leftEar' ,4:'rightEar', 
//5:'leftShoulder',6:'rightShoulder', ,7 : 'leftElbow', 8:'rightElbow'
//9:'leftWrist',10:'rightWrist', ,11:'leftHip',12:'rightHip', 13:'leftKnee', 
//14:'rightKnee',15:'leftAnkle',16:'rightAnkle'
const exerciseWantedIndex = {
    1: [5, 6, 7, 8, 9, 10, 11, 12],
    2: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    3: [],
    4: [],
    5: [],
    6: [],
};
const keyPointsNumbersToNames={
    0:'nose', 1:'leftEye', 2:'rightEye', 3:'leftEar' ,4:'rightEar',
    5:'leftShoulder',6:'rightShoulder', 7 : 'leftElbow', 8:'rightElbow',
    9:'leftWrist',10:'rightWrist', 11:'leftHip',12:'rightHip', 13:'leftKnee', 
    14:'rightKnee',15:'leftAnkle',16:'rightAnkle'
}




const userId = getCookie("userId");
if (!userId) window.location.href="error.html";
window.onload=async ()=>{
    try{
        const response = await fetch("http://localhost:8080/espcam");
        const data = await response.json();;
        //console.log(data.ip);
        checkServerAvailability(data.ip, maxWaitTime);
    }
    catch{
        alert("There is a problem ): Our Server is not available,refresh the page")    
        window.location.href="./index.html";

    }
   
}

  

function checkServerAvailability(serverIP, timeout) {
    var serverUrl = 'http://'+serverIP+":81/stream"; 
    console.log(serverUrl);
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => controller.abort(), timeout);
    fetch(serverUrl, { signal })
        .then(() => {
            console.log('Server is running');
            imageElement.src=serverUrl;
            imageElement.style.display="";
            document.getElementById('exercisePopup').style.display = 'block';

        })
        .catch(error => {
            console.log('Server is not running or connection timed out');
            alert("ESP Cam Server is not running.Make Sure the Cam is Working");
            window.location.href="./index.html";
        });
}



function recognizePoseFramesAuto() {
    posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        multiplier: 0.75
    }).then(function (net) {
            return net.estimateSinglePose(imageElement, {
            flipHorizontal: false
        });
    }).then(function (pose) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawKeypoints(pose.keypoints);
            var currentPose = [];
            pose.keypoints.forEach((point, index) => {
                if (exerciseWantedIndex[excercie].includes(index)) {
                    const currentPart = { part: index, position: point.position };
                    currentPose.push(currentPart);
                }
            });
            poses.push(currentPose);

        })
}


function drawKeypoints(keypoints) {
    for (let i = 0; i < keypoints.length; i++) {
        let keypoint = keypoints[i];
        if (keypoint.score > 0.5) {
            ctx.beginPath();
            ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.stroke();
        }
    }
}


var excercie = 0;
function selectExercise(popupExerciseSelected) {
    excercie = popupExerciseSelected;
    console.log("Selected Exercise:", excercie);
    document.getElementById('exercisePopup').style.display = 'none';
    document.getElementById('startButton').style.display = "block";
    
    // Display the popup message
    var popup = document.getElementById('therapy-guidance-popup');
    popup.style.display = 'block';
    var popupGuidanceVideo = document.getElementById('exerciseVideo');
    popupGuidanceVideo.src="./img/"+excercie+".mp4"
    popupGuidanceVideo.play();

}

function closeTherapyGuidancePopup() {
    var popup = document.getElementById('therapy-guidance-popup');
    popup.style.display = 'none';
}




var countdown=5;
let timerDisplay = document.getElementById('timer');

async function startTherapy(){
    console.log("start!!");
    countdownInterval=setInterval(()=>{
        countdown -= 1; 
        timerDisplay.textContent = `Time Left: ${countdown}`;
    },1000);
    poseDetection = setInterval(() => {
        recognizePoseFramesAuto();
    }, 400);
    setTimeout(async()=>{
        audioElement.play();
        clearInterval(poseDetection);
        clearInterval(countdownInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        timerDisplay.textContent = 'Countdown finished';
        const response = await fetch("http://localhost:8080/espcam/dtw", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ keypoints: poses,exeNum:excercie }) // Send 'poses' array as JSON data
        });
        const data = await response.json();
        console.log(data)

        var message="You need to improve in: \n"
        const server_result_respone=data.result.not_accurate_part;
        server_result_respone.forEach((num)=> {
            message=message+keyPointsNumbersToNames[num]+",\n";
        });

        document.getElementById('popupData').textContent =message;
        document.getElementById('popup-result-id').style.display = 'block';
        //const IsSavingTraining = confirm('Do you want to save the training session in history?');
        //if(IsSavingTraining)saveTrainingSession(server_result_respone,userId);

    },1000*(countdown+1));
}



async function saveTrainingSession(sessionData,uid){
    const response = await fetch("http://localhost:8080/espcam/saveHistory", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({data:sessionData,userId:uid}) 
    });
}

