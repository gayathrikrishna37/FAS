import datetime
import random

# Define the start and end dates
start_date = datetime.datetime(2023, 8, 12, 12, 17, 29)
end_date = start_date + datetime.timedelta(minutes=10) * 100

# Define the initial and final water levels
initial_water_level = 10
final_water_level = 17

# Generate data points
data_points = []
for i in range(100):
    time_diff = (end_date - start_date).total_seconds()
    current_time = start_date + datetime.timedelta(seconds=(i / 100) * time_diff)
    rainfall = random.uniform(0, 1)
    water_level = initial_water_level + ((final_water_level - initial_water_level) * (i / 100))
    data_points.append(f"{current_time.strftime('%Y-%m-%d %H:%M:%S')},{rainfall:.2f},{water_level:.2f}")

# Save data to a file
with open("generated_data.csv", "w") as f:
    f.write("datetime,rainfall,waterlevel\n")
    f.write("\n".join(data_points))
