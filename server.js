const express = require('express');// imports the 'express' module, which is a popular Node.js framework for building web applications.
const fs = require('fs');//functions for working with the file system
const app = express();// initializes an instance of the Express application.
const axios = require('axios'); // Import the axios librarynp
const port = 3000;
let data = [];
let level;
function getCurrentDateTime() {// defines the 'getCurrentDateTime' function, which returns the current date and time in a formatted string.
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = now.toISOString().slice(11, 19);
  return `${formattedDate} ${formattedTime}`;
}

function performLongPolling() {//defines the 'performLongPolling' function, which uses the Axios library to make a GET request to a specified URL for long polling. It returns a Promise that resolves with the response data.
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

function writeDataToFile() {//constructs a CSV-formatted string from the 'data' array and writes it to a file named 'LiveData.csv
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

function startLongPollingAndWriting() {// initiates the long polling process using the 'performLongPolling' function. 
  //It collects the response data, along with the current date and time, and adds it to the 'data' array.
  performLongPolling()
    .then(responseData => {
      const dateTime = getCurrentDateTime();
      const waterLevel = responseData; // Adjust key as per the actual response structure
      level = waterLevel
      const rainfall = 0; // Replace this with actual rainfall data
      data.push(`${dateTime},${rainfall},${waterLevel}`); // Add data to the array
      console.log(data);
    })
    .catch(error => {
      console.error('Error during long polling:', error);
    })
    .finally(() => {
      setTimeout(startLongPollingAndWriting, 10000);
    });
}

startLongPollingAndWriting();
// Schedule data writing every 2hr
setInterval(writeDataToFile,  2 * 60 * 60 * 1000);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
