import pandas as pd
from flask import Flask, request, jsonify
import mlflow
import numpy as np
import matplotlib.pyplot as plt
from pandas import read_csv
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Dense, LSTM
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error
import requests
from datetime import datetime, timedelta
# Define the app
app = Flask(__name__)


def getHistoryData():
    now = datetime.today()
    sub24mins = datetime.today() - timedelta(hours=0, minutes=24)
    now_in_ms = int(float(now.strftime('%s.%f'))*1000)
    sub24mins_in_ms = int(float(sub24mins.strftime('%s.%f'))*1000)

    response = requests.get(
        "http://localhost:3005/trainData", params={"startTs": sub24mins_in_ms, "endTs": now_in_ms})
    # Check the response
    if response.status_code == 200:
        print("POST Request Successful")

        json_data = response.json()
        historyData = json_data.get('data')

        return historyData
    else:
        print("Error")
        return False


def load_data(file_path, column_index):
    df = read_csv(file_path, usecols=[column_index], engine='python')
    data = df.values.astype('float32')
    return data


def create_and_train_lstm_model(input_shape):
    model = Sequential()
    model.add(LSTM(4, input_shape=input_shape))
    model.add(Dense(1))
    model.compile(loss='mean_squared_error', optimizer='adam')
    return model


def create_dataset(dataset, look_back=1):
    dataX, dataY = [], []
    for i in range(len(dataset)-look_back-1):
        a = dataset[i:(i+look_back), 0]
        dataX.append(a)
        dataY.append(dataset[i + look_back, 0])
    return np.array(dataX), np.array(dataY)


def train_and_predict(model, trainX, testX, trainY):
    model.fit(trainX, trainY, epochs=10, batch_size=1, verbose=2)
    trainPredict = model.predict(trainX)
    testPredict = model.predict(testX)
    return trainPredict, testPredict


def plot_predictions(dataset, trainPredict, testPredict, look_back):
    trainPredictPlot = np.full_like(dataset, fill_value=np.nan)
    trainPredictPlot[look_back:len(trainPredict)+look_back, :] = trainPredict

    testPredictPlot = np.full_like(dataset, fill_value=np.nan)
    testPredictPlot[len(trainPredict)+(look_back*2) +
                    1:len(dataset)-1, :] = testPredict

    plt.plot(scaler.inverse_transform(dataset))
    plt.plot(trainPredictPlot)
    plt.plot(testPredictPlot)
    plt.show()


def split_data(data, train_ratio):
    train_size = int(len(data) * train_ratio)
    test_size = len(data) - train_size
    train, test = data[0:train_size, :], data[train_size:len(data), :]
    return train, test


def reshape_data_for_lstm(data):
    return np.reshape(data, (data.shape[0], 1, data.shape[1]))


def invert_predictions(trainPredict, trainY, testPredict, testY):
    trainPredict = scaler.inverse_transform(trainPredict)
    trainY = scaler.inverse_transform([trainY])
    testPredict = scaler.inverse_transform(testPredict)
    testY = scaler.inverse_transform([testY])
    return trainPredict, trainY, testPredict, testY


def calculate_rmse(actual, predicted):
    return np.sqrt(mean_squared_error(actual[0], predicted[:, 0]))


# Load the dataset
# temp = load_data('multimeasurementsData.csv', column_index=1)
# humidity = load_data('multimeasurementsData.csv', column_index=2)
# soil_moisture = load_data('multimeasurementsData.csv', column_index=3)
# uv = load_data('multimeasurementsData.csv', column_index=4)
# rain = load_data('multimeasurementsData.csv', column_index=5)


# Get history data
history_data = getHistoryData()
historyDf = pd.DataFrame.from_dict(
    history_data, orient='columns')

temp = historyDf[['temperature']]
humidity = historyDf[['humidity']]
soil_moisture = historyDf[['soil_moisture']]
uv = historyDf[['uv']]
rain = historyDf[['rain']]

# Fix random seed for reproducibility
tf.random.set_seed(7)

# Normalize the dataset
scaler = MinMaxScaler(feature_range=(0, 1))
temp, humidity, soil_moisture, uv, rain = map(
    scaler.fit_transform, [temp, humidity, soil_moisture, uv, rain])

# Set our tracking server uri for logging
mlflow.set_tracking_uri(uri="http://127.0.0.1:8888")

# Create a new MLflow Experiment
mlflow.set_experiment("Default")

# Start an MLFlow run
with mlflow.start_run() as run:

    # ////////////////////////////////////////////////////////////////////////////////////////

    temp_train, temp_test = split_data(temp, train_ratio=0.67)
    humidity_train, humidity_test = split_data(humidity, train_ratio=0.67)
    soil_moisture_train, soil_moisture_test = split_data(
        soil_moisture, train_ratio=0.67)
    uv_train, uv_test = split_data(uv, train_ratio=0.67)
    rain_train, rain_test = split_data(rain, train_ratio=0.67)

    # Reshape into X=t and Y=t+1
    look_back = 1
    temp_trainX, temp_trainY = create_dataset(temp_train, look_back)
    temp_testX, temp_testY = create_dataset(temp_test, look_back)

    humidity_trainX, humidity_trainY = create_dataset(
        humidity_train, look_back)
    humidity_testX, humidity_testY = create_dataset(humidity_test, look_back)

    soil_moisture_trainX, soil_moisture_trainY = create_dataset(
        soil_moisture_train, look_back)
    soil_moisture_testX, soil_moisture_testY = create_dataset(
        soil_moisture_test, look_back)

    uv_trainX, uv_trainY = create_dataset(uv_train, look_back)
    uv_testX, uv_testY = create_dataset(uv_test, look_back)

    rain_trainX, rain_trainY = create_dataset(rain_train, look_back)
    rain_testX, rain_testY = create_dataset(rain_test, look_back)

    # Reshape input to be [samples, time steps, features]
    temp_trainX, temp_testX = map(reshape_data_for_lstm, [
                                  temp_trainX, temp_testX])
    humidity_trainX, humidity_testX = map(
        reshape_data_for_lstm, [humidity_trainX, humidity_testX])
    soil_moisture_trainX, soil_moisture_testX = map(
        reshape_data_for_lstm, [soil_moisture_trainX, soil_moisture_testX])
    uv_trainX, uv_testX = map(reshape_data_for_lstm, [uv_trainX, uv_testX])
    rain_trainX, rain_testX = map(reshape_data_for_lstm, [
                                  rain_trainX, rain_testX])

    # Create and train LSTM models
    temp_model = create_and_train_lstm_model(input_shape=(1, look_back))
    humidity_model = create_and_train_lstm_model(input_shape=(1, look_back))
    soil_moisture_model = create_and_train_lstm_model(
        input_shape=(1, look_back))
    uv_model = create_and_train_lstm_model(input_shape=(1, look_back))
    rain_model = create_and_train_lstm_model(input_shape=(1, look_back))

    # Train and predict for each variable
    temp_trainPredict, temp_testPredict = train_and_predict(
        temp_model, temp_trainX, temp_testX, temp_trainY)
    humidity_trainPredict, humidity_testPredict = train_and_predict(
        humidity_model, humidity_trainX, humidity_testX, humidity_trainY)
    soil_moisture_trainPredict, soil_moisture_testPredict = train_and_predict(
        soil_moisture_model, soil_moisture_trainX, soil_moisture_testX, soil_moisture_trainY)
    uv_trainPredict, uv_testPredict = train_and_predict(
        uv_model, uv_trainX, uv_testX, uv_trainY)
    rain_trainPredict, rain_testPredict = train_and_predict(
        rain_model, rain_trainX, rain_testX, uv_trainY)

    # Invert predictions
    temp_trainPredict, temp_trainY, temp_testPredict, temp_testY = invert_predictions(
        temp_trainPredict, temp_trainY, temp_testPredict, temp_testY)
    humidity_trainPredict, humidity_trainY, humidity_testPredict, humidity_testY = invert_predictions(
        humidity_trainPredict, humidity_trainY, humidity_testPredict, humidity_testY)
    soil_moisture_trainPredict, soil_moisture_trainY, soil_moisture_testPredict, soil_moisture_testY = invert_predictions(
        soil_moisture_trainPredict, soil_moisture_trainY, soil_moisture_testPredict, soil_moisture_testY)
    uv_trainPredict, uv_trainY, uv_testPredict, uv_testY = invert_predictions(
        uv_trainPredict, uv_trainY, uv_testPredict, uv_testY)
    rain_trainPredict, rain_trainY, rain_testPredict, rain_testY = invert_predictions(
        rain_trainPredict, rain_trainY, rain_testPredict, rain_testY)

    # Calculate root mean squared error
    temp_trainScore = calculate_rmse(temp_trainY, temp_trainPredict)
    print('Temp train Score: %.2f RMSE' % temp_trainScore)
    temp_testScore = calculate_rmse(temp_testY, temp_testPredict)
    print('Temp test Score: %.2f RMSE' % temp_testScore)

    humidity_trainScore = calculate_rmse(
        humidity_trainY, humidity_trainPredict)
    print('Humidity train Score: %.2f RMSE' % humidity_trainScore)
    humidity_testScore = calculate_rmse(humidity_testY, humidity_testPredict)
    print('Humidity test Score: %.2f RMSE' % humidity_testScore)

    soil_moisture_trainScore = calculate_rmse(
        soil_moisture_trainY, soil_moisture_trainPredict)
    print('Soil moisture train Score: %.2f RMSE' % soil_moisture_trainScore)
    soil_moisture_testScore = calculate_rmse(
        soil_moisture_testY, soil_moisture_testPredict)
    print('Soil moisture test Score: %.2f RMSE' % soil_moisture_testScore)

    uv_trainScore = calculate_rmse(uv_trainY, uv_trainPredict)
    print('UV train Score: %.2f RMSE' % uv_trainScore)
    uv_testScore = calculate_rmse(uv_testY, uv_testPredict)
    print('UV test Score: %.2f RMSE' % uv_testScore)

    rain_trainScore = calculate_rmse(rain_trainY, rain_trainPredict)
    print('Rain train Score: %.2f RMSE' % rain_trainScore)
    rain_testScore = calculate_rmse(rain_testY, rain_testPredict)
    print('Rain test Score: %.2f RMSE' % rain_testScore)
    # ////////////////////////////////////////////////////////////////////////////////////////
    # Plot predictions
    # plot_predictions(temp, temp_trainPredict, temp_testPredict, look_back)
    # plot_predictions(humidity, humidity_trainPredict,
    #                  humidity_testPredict, look_back)
    # plot_predictions(soil_moisture, soil_moisture_trainPredict,
    #                  soil_moisture_testPredict, look_back)
    # plot_predictions(uv, uv_trainPredict, uv_testPredict, look_back)
    # plot_predictions(rain, rain_trainPredict, rain_testPredict, look_back)

    # signature = infer_signature(X_train, model.predict(X_train))
    # # Log the model
    # model_info = mlflow.sklearn.log_model(
    #     sk_model=model,
    #     artifact_path='',
    #     signature=signature,
    #     input_example=X_train,
    #     registered_model_name="default",
    # )
    # Log metrics to MLFlow
    # log_metric('RMSE', metrics.mean_squared_error(
    #     X_test, predictions), run)

    # Save the LSTM model to MLFlow
    # mlflow.log_artifact(model, 'model')

    # Define the API endpoint for forecasting

    @app.route('/predict', methods=['POST'])
    def predict():
        historyMeasurementsDf = pd.DataFrame.from_dict(
            request.get_json(), orient='columns')
        history_temp = historyMeasurementsDf[['temperature']]
        history_temp = history_temp.values.astype('float32')
        history_temp = scaler.fit_transform(history_temp)
        history_temp = np.array(history_temp)
        history_temp = map(reshape_data_for_lstm, [
            history_temp])
        predicted_temp = temp_model.predict(history_temp)
        predicted_temp = scaler.inverse_transform(predicted_temp)

        history_humidity = historyMeasurementsDf[['humidity']]
        history_humidity = history_humidity.values.astype('float32')
        history_humidity = scaler.fit_transform(history_humidity)
        history_humidity = np.array(history_humidity)
        history_humidity = map(reshape_data_for_lstm, [
            history_humidity])
        predicted_humidity = humidity_model.predict(history_humidity)
        predicted_humidity = scaler.inverse_transform(predicted_humidity)

        history_rain = historyMeasurementsDf[['rain']]
        history_rain = history_rain.values.astype('float32')
        history_rain = scaler.fit_transform(history_rain)
        history_rain = np.array(history_rain)
        history_rain = map(reshape_data_for_lstm, [
            history_rain])
        predicted_rain = rain_model.predict(history_rain)
        predicted_rain = scaler.inverse_transform(predicted_rain)

        history_soil_moisture = historyMeasurementsDf[['soil_moisture']]
        history_soil_moisture = history_soil_moisture.values.astype('float32')
        history_soil_moisture = scaler.fit_transform(history_soil_moisture)
        history_soil_moisture = np.array(history_soil_moisture)
        history_soil_moisture = map(reshape_data_for_lstm, [
            history_soil_moisture])
        predicted_soil_moisture = soil_moisture_model.predict(
            history_soil_moisture)
        predicted_soil_moisture = scaler.inverse_transform(
            predicted_soil_moisture)

        history_uv = historyMeasurementsDf[['uv']]
        history_uv = history_uv.values.astype('float32')
        history_uv = scaler.fit_transform(history_uv)
        history_uv = np.array(history_uv)
        history_uv = map(reshape_data_for_lstm, [
            history_uv])
        predicted_uv = uv_model.predict(history_uv)
        predicted_uv = scaler.inverse_transform(predicted_uv)

        # Return the predictions as a JSON response
        return jsonify({
            'predicted_timestamp':  historyMeasurementsDf[['timestamp']].values.tolist(),
            'predicted_temperature': predicted_temp.tolist(),
            'predicted_humidity': predicted_humidity.tolist(),
            'predicted_rain': predicted_rain.tolist(),
            'predicted_soil_moisture': predicted_soil_moisture.tolist(),
            'predicted_uv': predicted_uv.tolist()
        })

if __name__ == '__main__':
    app.run(debug=True)
