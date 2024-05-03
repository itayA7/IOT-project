const userId = getCookie("userId");
if (!userId) window.location.href="error.html";
const keyPointsNumbersToNames = {
    0: 'nose', 1: 'leftEye', 2: 'rightEye', 3: 'leftEar', 4: 'rightEar',
    5: 'leftShoulder', 6: 'rightShoulder', 7: 'leftElbow', 8: 'rightElbow',
    9: 'leftWrist', 10: 'rightWrist', 11: 'leftHip', 12: 'rightHip', 13: 'leftKnee',
    14: 'rightKnee', 15: 'leftAnkle', 16: 'rightAnkle'
};


window.onload=async ()=>{
    const response = await fetch("http://localhost:8080/espcam/getUserHistory", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json", // set the content type to JSON
      },
      body: JSON.stringify({userId:userId}),
    });
    const userHistory=await response.json()
    console.log(userHistory);
    console.log(userHistory.userHistory);
    populateHistoryTable(userHistory.userHistory)
}



function populateHistoryTable(userHistory) {
    const tableBody = document.getElementById('historyTableBody');
    // Clear existing table rows
    tableBody.innerHTML = '';
    // Populate table with user history
    userHistory.reverse().forEach(historyRecord => {
      const row = document.createElement('tr');
      const exerciseCell = document.createElement('td');
      exerciseCell.textContent = historyRecord.exercise;
      console.log(historyRecord.exercise);
      const dateCell = document.createElement('td');
      dateCell.textContent = historyRecord.date;
      const notAccuratePartsCell = document.createElement('td');
      if(historyRecord.not_accurate_parts){
        const notAccuratePartsToNames=historyRecord.not_accurate_parts.map(number => keyPointsNumbersToNames[number]);
        notAccuratePartsCell.textContent = notAccuratePartsToNames.join(', '); // Convert array to string
      }
      else{
        notAccuratePartsCell.textContent="nothing to improve!"
      }
      row.appendChild(dateCell);
      row.append(exerciseCell);
      row.appendChild(notAccuratePartsCell);
      tableBody.appendChild(row);
    });
  }