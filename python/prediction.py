from __future__ import print_function
import os
os.environ["THEANO_FLAGS"] = "mode=FAST_RUN,device=gpu,floatX=float32"

import numpy as np
import matplotlib.pyplot as plt
import pandas
import math
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from sklearn.preprocessing import MinMaxScaler
from keras.models import model_from_json


plt.style.use('ggplot')
np.random.seed(10)



# ... (previous training code) ...

# Load your MinMaxScaler or other scaler used during training
scaler = MinMaxScaler(feature_range=(0, 1))

# Load the saved model architecture from a JSON file
with open("python\model_architecture_new.json", "r") as json_file:
    loaded_model_json = json_file.read()
loaded_model = model_from_json(loaded_model_json)

# Load the saved model weights from an HDF5 file
loaded_model.load_weights("python\model_weights _new.h5")

# Load training data
dataframe = pandas.read_csv('flood_train.csv', usecols=[1], engine='python', skipfooter=3)
dataset = dataframe.values
dataset = dataset.astype('float32')
scaler = MinMaxScaler(feature_range=(0, 1))
scaler.fit(dataset)  # Fit the scaler on the training data

# Load your live data
new_data = pandas.read_csv('LiveData.csv', sep=',')

# Preprocess new data
new_water_level = new_data['waterlevel'].values
scaled_new_water_level = scaler.transform(new_water_level.reshape(-1, 1))

# Create input sequences with sliding window
slide_window = 10
new_data_sequences = []
for i in range(len(scaled_new_water_level) - slide_window - 1):
    sequence = scaled_new_water_level[i:i + slide_window, 0]
    new_data_sequences.append(sequence)
new_data_sequences = np.array(new_data_sequences)

# Reshape the input data to match the input shape of the model
reshaped_new_data = np.reshape(new_data_sequences, (new_data_sequences.shape[0], 1, new_data_sequences.shape[1]))

# Make predictions using the loaded model
predictions = loaded_model.predict(reshaped_new_data)

# Inverse transform the predictions to get the original scale
original_predictions = scaler.inverse_transform(predictions)

# Print or use the predictions as needed
print("Predictions:", original_predictions)
