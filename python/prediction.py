import numpy as np
import pandas
from keras.models import model_from_json
from sklearn.preprocessing import MinMaxScaler
from flask import Flask, jsonify
import time

np.random.seed(10)

# Load model architecture and weights
with open("python\model_architecture_new.json", "r") as json_file:
    loaded_model_json = json_file.read()
loaded_model = model_from_json(loaded_model_json)
loaded_model.load_weights("python\model_weights _new.h5")

# Load historical data and scale it
dataframe = pandas.read_csv('flood_train.csv', usecols=[1], engine='python', skipfooter=3)
dataset = dataframe.values
dataset = dataset.astype('float32')
scaler = MinMaxScaler(feature_range=(0, 1))
scaler.fit(dataset)

# Initialize empty list for storing predictions
predicted_water_levels = []
slide_window = 10

# Function to make predictions and update the list
def make_prediction(new_water_level):
    scaled_new_water_level = scaler.transform(np.array(new_water_level).reshape(-1, 1))
    new_data_sequences = []
    sequence = scaled_new_water_level[-slide_window:, 0]
    new_data_sequences.append(sequence)
    new_data_sequences = np.array(new_data_sequences)
    reshaped_new_data = np.reshape(new_data_sequences, (new_data_sequences.shape[0], 1, new_data_sequences.shape[1]))
    prediction = loaded_model.predict(reshaped_new_data)
    original_prediction = scaler.inverse_transform(prediction)
    return original_prediction[0][0]

# Function to write predicted water levels to a file
def write_to_file(data):
    with open('predicted_water_levels.txt', 'w') as file:
        for value in data:
            file.write(str(value) + '\n')

# Simulate receiving new data and making predictions every 5 seconds
prediction_interval = 5  # seconds
write_interval = 60  # seconds
last_write_time = time.time()

while True:
    new_data = pandas.read_csv('LiveData.csv', sep=',')
    new_water_level = new_data['waterlevel'].values
    predicted_value = make_prediction(new_water_level)
    predicted_water_levels.append(predicted_value)
    
    current_time = time.time()
    
    if current_time - last_write_time >= write_interval:
        write_to_file(predicted_water_levels)
        last_write_time = current_time
    
    print(predicted_water_levels)
    time.sleep(prediction_interval)


