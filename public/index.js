
let waterLevelChart;
let waterLevel;
const predicted = document.getElementById('Predicted-water-level');
const current = document.getElementById('Current-water-level');
const rain = document.getElementById('rain-fall-level');
let rain_fall_level = 8;
function fetchPredictedData() {
    return fetch('predicted_water_levels.txt')
        .then(response => response.text())
        .then(textData => {
            const lines = textData.trim().split('\n');
            const predictedData = lines.map(line => parseFloat(line));
            return predictedData;
        })
        .catch(error => {
            console.error('Error fetching predicted data:', error);
            return [];
        });
}
function updateChart() {
    fetchPredictedData().then(predictedData => {
        const currentTime = new Date();
        const timeLabels = [];
        
        // Generate time labels with 2-hour intervals starting from the current time
        const ctx = document.getElementById('waterLevelChart').getContext('2d');
        waterLevelChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [0,2,4,6,8,10,12,14,16,18,20,22,24],
                datasets: [{
                    label: 'Predicted Water Level',
                    data: predictedData ,
                    borderColor: 'orange',
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
   const lastIndex = predictedData.length - 1;
  document.getElementById('predicted-level').textContent = `${predictedData[lastIndex]}m`;
  if(predictedData[lastIndex] > 20){
    predicted.classList.add('alert-red')
  }else if(predictedData[lastIndex] > 17){
    predicted.classList.add('alert-orange')
  }else if(predictedData[lastIndex] > 15){
    predicted.classList.add('alert-yellow')
        
    };
}
    )}

function getWaterLevel(){
    fetch('https://blr1.blynk.cloud/external/api/get?token=HLbiwdCZek4VRg6o_3SD5dKveW5zLu6f&v0')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse response body as JSON
  })
  .then(data => {
    console.log(data); // Process the data
    waterLevel = data
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
  document.getElementById('Current-level').textContent = `${waterLevel}m`;
  if(waterLevel > 20){
    current.classList.add('alert-red')
  }else if(waterLevel < 20  && waterLevel > 20){
    current.classList.add('alert-orange')
  }else if(waterLevel < 17 && waterLevel > 10){
    current.classList.add('alert-yellow')
    };

}

document.getElementById('level').textContent = `${rain_fall_level}m`;
if(rain_fall_level > 20){
  rain.classList.add('alert-red')
}else if(rain_fall_level > 11 && rain_fall_level < 20){
  rain.classList.add('alert-orange')
}else if(rain_fall_level > 7 && rain_fall_level < 11){
  rain.classList.add('alert-yellow')
  };

function updateDateTime() {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
  
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    const currentDate = `${year}-${month}-${day}`;
    const currentTime = `${hours}:${minutes}:${seconds}`;
  
    document.getElementById('date').textContent = `Date: ${currentDate}`;
    document.getElementById('time').textContent = `Time: ${currentTime}`;
  }
  
  // Update the date and time every second
  setInterval(updateDateTime, 1000);
  
  // Initial call to set the date and time immediately
  updateDateTime();
  updateChart();



setInterval(getWaterLevel,1000)
// Update the chart every 1 minute
setInterval(updateChart, 7200000); // 1 minute in milliseconds
