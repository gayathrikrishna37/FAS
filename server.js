const express = require('express');
const fs = require('fs');
const app = express();
const axios = require('axios'); // Import the axios librarynp
const port = 3000;
let data = [];

function getCurrentDateTime() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = now.toISOString().slice(11, 19);
  return `${formattedDate} ${formattedTime}`;
}

function performLongPolling() {
  return new Promise((resolve, reject) => {
    axios.get('https://blr1.blynk.cloud/external/api/get?token=HLbiwdCZek4VRg6o_3SD5dKveW5zLu6f&v0')
      .then(response => {
        resolve(response.data); // response.data is the actual response content
      })
      .catch(error => {
        reject(error);
      });
  });
}

function writeDataToFile() {
  const csvData = `datetime,rainfall,waterlevel\n${data.join('\n')}`; 
  fs.writeFile('LiveData.csv', csvData, 'utf8', err => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data written to file');
    }
  });
  data = []; // Clear the data array after writing to the file
}

function startLongPollingAndWriting() {
  performLongPolling()
    .then(responseData => {
      const dateTime = getCurrentDateTime();
      const waterLevel = responseData; // Adjust key as per the actual response structure
      const rainfall = 0; // Replace this with actual rainfall data
      data.push(`${dateTime},${rainfall},${waterLevel}`); // Add data to the array
      console.log(data);
    })
    .catch(error => {
      console.error('Error during long polling:', error);
    })
    .finally(() => {
      setTimeout(startLongPollingAndWriting, 3000);
    });
}

startLongPollingAndWriting();

// Schedule data writing every 1 minute
setInterval(writeDataToFile, 60000);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
