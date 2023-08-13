let waterLevelChart;

function fetchPredictedData() {
    return fetch('predicted_water_levels.txt')
        .then(response => response.text())
        .then(textData => {
            const lines = textData.trim().split('\n');
            const predictedData = lines.map(line => parseFloat(line));
            console.log(predictedData);
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
        for (let i = 0; i < predictedData.length; i++) {
            const time = new Date(currentTime.getTime() + i * 2 * 60 * 60 * 1000); // 2 hours in milliseconds
            const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            timeLabels.push(formattedTime);
        }
        if (waterLevelChart) {
            waterLevelChart.destroy();
        }
        console.log(timeLabels);
        const ctx = document.getElementById('waterLevelChart').getContext('2d');
        waterLevelChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Predicted Water Level',
                    data: predictedData,
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
    });
}

// Initial chart update
updateChart();

// Update the chart every 1 minute
setInterval(updateChart, 60000); // 1 minute in milliseconds
