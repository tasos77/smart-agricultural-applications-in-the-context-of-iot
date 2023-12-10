import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import *
from flask import Flask, request, jsonify
from mlflow import start_run, log_metric, log_artifact, end_run
from sklearn import metrics
import mlflow
from keras.losses import MeanSquaredError
from keras.metrics import RootMeanSquaredError
from keras.optimizers import Adam

# Define the app
app = Flask(__name__)

# Load temperature data from CSV
data_path = 'temperature_data.csv'
df = pd.read_csv(data_path)

# Preprocess temperature data
# temperature_data = data['temperature'].tolist()
# temperature_data = np.array(temperature_data)

temp_df = df['temperature']


def df_to_X_y(data, window_size=5):
    df_as_np = data.to_numpy()
    X = []
    y = []
    for i in range(len(df_as_np)-window_size):
        row = [[a] for a in df_as_np[i:i+5]]
        X.append(row)
        label = df_as_np[i+5]
        y.append(label)
    return np.array(X), np.array(y)


X, y = df_to_X_y(temp_df, 5)

X_train, y_train = X[:70], y[:70]
X_val, y_val = X[70:90], y[70:90]
X_test, y_test = X[90:], y[90:]

print(X_train.shape, y_train.shape, X_val.shape,
      y_val.shape, X_test.shape, y_test.shape)

# Start an MLFlow run
with mlflow.start_run() as run:

    # Split data into training and testing sets
    # train_size = int(len(temperature_data) * 0.8)
    # train_data = temperature_data[:train_size]
    # test_data = temperature_data[train_size:]

    # Configure LSTM model
    model = Sequential()
    model.add(InputLayer((5, 1)))
    model.add(LSTM(64))
    model.add(Dense(8, 'relu'))
    model.add(Dense(1, 'linear'))
    model.summary()
    # # Input shape: (timestep, feature)
    # model.add(LSTM(units=50, return_sequences=True, input_shape=(60, 1)))
    # model.add(LSTM(units=50))
    # model.add(Dense(units=1))  # Output layer (single prediction)

    # Compile the model using Mean Squared Error loss and Adam optimizer
    # model.compile(loss='mse', optimizer='adam')
    model.compile(loss=MeanSquaredError(), optimizer=Adam(
        learning_rate=0.0001), metrics=[RootMeanSquaredError()])
    # Train the LSTM model on the training sequences
    model.fit(X_train, y_train, validation_data=(
        X_val, y_val),  epochs=10, batch_size=32)

    # Scale and predict temperature values
    scaler = MinMaxScaler(feature_range=(0, 1))
    # scaled_temperature_data = scaler.fit_transform(
    #     temp_df.reshape(-1, 1))

    # test_sequences = []
    # for i in range(60, len(scaled_temperature_data)):
    #     sequence = scaled_temperature_data[i - 60:i]
    #     sequence = sequence.reshape(1, 60, 1)
    #     test_sequences.append(sequence)

    # predictions = model.predict(test_sequences)
    predictions = model.predict(X_train).flatten()
    # predicted_temperatures = scaler.inverse_transform(predictions)

    # Log metrics to MLFlow
    # log_metric('RMSE', metrics.mean_squared_error(
    #     X_test, predictions), run)

    # Save the LSTM model to MLFlow
    # mlflow.artifacts.save_artifact(model, 'model')

    # Define the API endpoint for forecasting
    @app.route('/predict', methods=['POST'])
    def predict():
        # Receive temperature data as JSON
        temperature_data = request.get_json()['temperature_data']

        # Scale the received temperature data
        scaled_data = scaler.transform(temperature_data)

        # Make predictions based on the scaled data
        predictions = model.predict(scaled_data[-60:].reshape(1, 60, 1))

        # Unscale the predictions
        unscaled_predictions = scaler.inverse_transform(predictions)

        # Return the predictions as a JSON response
        return jsonify({'predicted_temperatures': unscaled_predictions.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
