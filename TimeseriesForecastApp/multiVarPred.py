# # LSTM for international airline passengers problem with regression framing
# import numpy as np
# import matplotlib.pyplot as plt
# from pandas import read_csv
# import math
# import tensorflow as tf
# from keras.models import Sequential
# from keras.layers import Dense
# from keras.layers import LSTM
# from sklearn.preprocessing import MinMaxScaler
# from sklearn.metrics import mean_squared_error

# # load the dataset
# temp_df = read_csv('multimeasurementsData.csv', usecols=[1], engine='python')
# temp = temp_df.values
# temp = temp.astype('float32')

# humidity_df = read_csv('multimeasurementsData.csv',
#                        usecols=[2], engine='python')
# humidity = humidity_df.values
# humidity = humidity.astype('float32')

# soil_moisture_df = read_csv(
#     'multimeasurementsData.csv', usecols=[3], engine='python')
# soil_moisture = soil_moisture_df.values
# soil_moisture = soil_moisture.astype('float32')

# uv_df = read_csv('multimeasurementsData.csv', usecols=[4], engine='python')
# uv = uv_df.values
# uv = uv.astype('float32')

# rain_df = read_csv('multimeasurementsData.csv', usecols=[5], engine='python')
# rain = rain_df.values
# rain = rain.astype('float32')

# # convert an array of values into a dataset matrix


# def create_dataset(dataset, look_back=1):
#     dataX, dataY = [], []
#     for i in range(len(dataset)-look_back-1):
#         a = dataset[i:(i+look_back), 0]
#         dataX.append(a)
#         dataY.append(dataset[i + look_back, 0])
#     return np.array(dataX), np.array(dataY)


# # fix random seed for reproducibility
# tf.random.set_seed(7)

# # normalize the dataset
# scaler = MinMaxScaler(feature_range=(0, 1))

# temp = scaler.fit_transform(temp)
# humidity = scaler.fit_transform(humidity)
# soil_moisture = scaler.fit_transform(soil_moisture)
# uv = scaler.fit_transform(uv)
# rain = scaler.fit_transform(rain)

# # split into train and test sets
# temp_train_size = int(len(temp) * 0.67)
# temp_test_size = len(temp) - temp_train_size
# temp_train, temp_test = temp[0:temp_train_size,
#                              :], temp[temp_train_size:len(temp), :]

# humidity_train_size = int(len(humidity) * 0.67)
# humidity_test_size = len(humidity) - humidity_train_size
# humidity_train, humidity_test = temp[0:humidity_train_size,
#                                      :], humidity[humidity_train_size:len(humidity), :]

# soil_moisture_train_size = int(len(soil_moisture) * 0.67)
# soil_moisture_test_size = len(temp) - soil_moisture_train_size
# soil_moisture_train, soil_moisture_test = temp[0:soil_moisture_train_size,
#                                                :], soil_moisture[soil_moisture_train_size:len(soil_moisture), :]

# uv_train_size = int(len(uv) * 0.67)
# uv_test_size = len(uv) - uv_train_size
# uv_train, uv_test = uv[0:uv_train_size, :], uv[uv_train_size:len(uv), :]

# rain_train_size = int(len(rain) * 0.67)
# rain_test_size = len(rain) - rain_train_size
# rain_train, rain_test = rain[0:rain_train_size,
#                              :], rain[rain_train_size:len(rain), :]

# # reshape into X=t and Y=t+1
# look_back = 1

# temp_trainX, temp_trainY = create_dataset(temp_train, look_back)
# temp_testX, temp_testY = create_dataset(temp_test, look_back)

# humidity_trainX, humidity_trainY = create_dataset(humidity_train, look_back)
# humidity_testX, humidity_testY = create_dataset(humidity_test, look_back)

# soil_moisture_trainX, soil_moisture_trainY = create_dataset(
#     soil_moisture_train, look_back)
# soil_moisture_testX, soil_moisture_testY = create_dataset(
#     soil_moisture_test, look_back)

# uv_trainX, uv_trainY = create_dataset(uv_train, look_back)
# uv_testX, uv_testY = create_dataset(uv_test, look_back)

# rain_trainX, rain_trainY = create_dataset(rain_train, look_back)
# rain_testX, rain_testY = create_dataset(rain_test, look_back)


# # reshape input to be [samples, time steps, features]
# temp_trainX = np.reshape(
#     temp_trainX, (temp_trainX.shape[0], 1, temp_trainX.shape[1]))
# temp_testX = np.reshape(
#     temp_testX, (temp_testX.shape[0], 1, temp_testX.shape[1]))

# humidity_trainX = np.reshape(
#     humidity_trainX, (humidity_trainX.shape[0], 1, humidity_trainX.shape[1]))
# humidity_testX = np.reshape(
#     humidity_testX, (humidity_testX.shape[0], 1, humidity_testX.shape[1]))

# soil_moisture_trainX = np.reshape(
#     soil_moisture_trainX, (soil_moisture_trainX.shape[0], 1, soil_moisture_trainX.shape[1]))
# soil_moisture_testX = np.reshape(
#     soil_moisture_testX, (soil_moisture_testX.shape[0], 1, soil_moisture_testX.shape[1]))

# uv_trainX = np.reshape(uv_trainX, (uv_trainX.shape[0], 1, uv_trainX.shape[1]))
# uv_testX = np.reshape(uv_testX, (uv_testX.shape[0], 1, uv_testX.shape[1]))

# rain_trainX = np.reshape(
#     rain_trainX, (rain_trainX.shape[0], 1, rain_trainX.shape[1]))
# rain_testX = np.reshape(
#     rain_testX, (rain_testX.shape[0], 1, rain_testX.shape[1]))


# # Function to create and train an LSTM model


# def create_lstm_model():
#     model = Sequential()
#     model.add(LSTM(4, input_shape=(1, look_back)))
#     model.add(Dense(1))
#     model.compile(loss='mean_squared_error', optimizer='adam')
#     return model


# # Create separate models for each variable
# temp_model = create_lstm_model()
# humidity_model = create_lstm_model()
# soil_moisture_model = create_lstm_model()
# uv_model = create_lstm_model()
# rain_model = create_lstm_model()

# # Fit and predict for each variable
# temp_model.fit(temp_trainX, temp_trainY, epochs=100, batch_size=1, verbose=2)
# temp_trainPredict = temp_model.predict(temp_trainX)
# temp_testPredict = temp_model.predict(temp_testX)

# humidity_model.fit(humidity_trainX, humidity_trainY,
#                    epochs=100, batch_size=1, verbose=2)
# humidity_trainPredict = humidity_model.predict(humidity_trainX)
# humidity_testPredict = humidity_model.predict(humidity_testX)

# soil_moisture_model.fit(
#     soil_moisture_trainX, soil_moisture_trainY, epochs=100, batch_size=1, verbose=2)
# soil_moisture_trainPredict = soil_moisture_model.predict(soil_moisture_trainX)
# soil_moisture_testPredict = soil_moisture_model.predict(soil_moisture_testX)

# rain_model.fit(rain_trainX, rain_trainY, epochs=100, batch_size=1, verbose=2)
# rain_trainPredict = rain_model.predict(rain_trainX)
# rain_testPredict = rain_model.predict(rain_testX)

# uv_model.fit(uv_trainX, uv_trainY, epochs=100, batch_size=1, verbose=2)
# uv_trainPredict = uv_model.predict(uv_trainX)
# uv_testPredict = uv_model.predict(uv_testX)


# # invert predictions
# temp_trainPredict = scaler.inverse_transform(temp_trainPredict)
# temp_trainY = scaler.inverse_transform([temp_trainY])
# temp_testPredict = scaler.inverse_transform(temp_testPredict)
# temp_testY = scaler.inverse_transform([temp_testY])

# humidity_trainPredict = scaler.inverse_transform(humidity_trainPredict)
# humidity_trainY = scaler.inverse_transform([humidity_trainY])
# humidity_testPredict = scaler.inverse_transform(humidity_testPredict)
# humidity_testY = scaler.inverse_transform([humidity_testY])

# soil_moisture_trainPredict = scaler.inverse_transform(
#     soil_moisture_trainPredict)
# soil_moisture_trainY = scaler.inverse_transform([soil_moisture_trainY])
# soil_moisture_testPredict = scaler.inverse_transform(soil_moisture_testPredict)
# soil_moisture_testY = scaler.inverse_transform([soil_moisture_testY])

# uv_trainPredict = scaler.inverse_transform(uv_trainPredict)
# uv_trainY = scaler.inverse_transform([uv_trainY])
# uv_testPredict = scaler.inverse_transform(uv_testPredict)
# uv_testY = scaler.inverse_transform([uv_testY])

# rain_trainPredict = scaler.inverse_transform(rain_trainPredict)
# rain_trainY = scaler.inverse_transform([rain_trainY])
# rain_testPredict = scaler.inverse_transform(rain_testPredict)
# rain_testY = scaler.inverse_transform([rain_testY])

# # calculate root mean squared error
# temp_trainScore = np.sqrt(mean_squared_error(
#     temp_trainY[0], temp_trainPredict[:, 0]))
# print('Temp train Score: %.2f RMSE' % (temp_trainScore))
# temp_testScore = np.sqrt(mean_squared_error(
#     temp_testY[0], temp_testPredict[:, 0]))
# print('Temp test Score: %.2f RMSE' % (temp_testScore))

# humidity_trainScore = np.sqrt(mean_squared_error(
#     humidity_trainY[0], humidity_trainPredict[:, 0]))
# print('Humidity train Score: %.2f RMSE' % (humidity_trainScore))
# humidity_testScore = np.sqrt(mean_squared_error(
#     humidity_testY[0], humidity_testPredict[:, 0]))
# print('Humidity test Score: %.2f RMSE' % (humidity_testScore))

# soil_moisture_trainScore = np.sqrt(mean_squared_error(
#     soil_moisture_trainY[0], soil_moisture_trainPredict[:, 0]))
# print('Soil moisture train Score: %.2f RMSE' % (soil_moisture_trainScore))
# soil_moisture_testScore = np.sqrt(mean_squared_error(
#     soil_moisture_testY[0], soil_moisture_testPredict[:, 0]))
# print('Soil moisture test Score: %.2f RMSE' % (soil_moisture_testScore))

# uv_trainScore = np.sqrt(mean_squared_error(
#     uv_trainY[0], uv_trainPredict[:, 0]))
# print('UV train Score: %.2f RMSE' % (uv_trainScore))
# uv_testScore = np.sqrt(mean_squared_error(uv_testY[0], uv_testPredict[:, 0]))
# print('UV test Score: %.2f RMSE' % (uv_testScore))

# rain_trainScore = np.sqrt(mean_squared_error(
#     rain_trainY[0], rain_trainPredict[:, 0]))
# print('Rain train Score: %.2f RMSE' % (rain_trainScore))
# rain_testScore = np.sqrt(mean_squared_error(
#     rain_testY[0], rain_testPredict[:, 0]))
# print('Rain test Score: %.2f RMSE' % (rain_testScore))


# def plot_predictions(dataset, trainPredict, testPredict, look_back):
#     # shift train predictions for plotting
#     trainPredictPlot = np.empty_like(dataset)
#     trainPredictPlot[:, :] = np.nan
#     trainPredictPlot[look_back:len(trainPredict)+look_back, :] = trainPredict

#     # shift test predictions for plotting
#     testPredictPlot = np.empty_like(dataset)
#     testPredictPlot[:, :] = np.nan
#     testPredictPlot[len(trainPredict)+(look_back*2) +
#                     1:len(dataset)-1, :] = testPredict

#     # plot baseline and predictions
#     plt.plot(scaler.inverse_transform(dataset))
#     plt.plot(trainPredictPlot)
#     plt.plot(testPredictPlot)
#     plt.show()


# plot_predictions(temp, temp_trainPredict, temp_testPredict, look_back)
# plot_predictions(humidity, humidity_trainPredict,
#                  humidity_testPredict, look_back)
# plot_predictions(soil_moisture, soil_moisture_trainPredict,
#                  soil_moisture_testPredict, look_back)
# plot_predictions(uv, uv_trainPredict, uv_testPredict, look_back)
# plot_predictions(rain, rain_trainPredict, rain_testPredict, look_back)


import numpy as np
import matplotlib.pyplot as plt
from pandas import read_csv
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Dense, LSTM
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error


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
    model.fit(trainX, trainY, epochs=100, batch_size=1, verbose=2)
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


# Load the dataset
temp = load_data('multimeasurementsData.csv', column_index=1)
humidity = load_data('multimeasurementsData.csv', column_index=2)
soil_moisture = load_data('multimeasurementsData.csv', column_index=3)
uv = load_data('multimeasurementsData.csv', column_index=4)
rain = load_data('multimeasurementsData.csv', column_index=5)

# Fix random seed for reproducibility
tf.random.set_seed(7)

# Normalize the dataset
scaler = MinMaxScaler(feature_range=(0, 1))
temp, humidity, soil_moisture, uv, rain = map(
    scaler.fit_transform, [temp, humidity, soil_moisture, uv, rain])

# Split into train and test sets


def split_data(data, train_ratio):
    train_size = int(len(data) * train_ratio)
    test_size = len(data) - train_size
    train, test = data[0:train_size, :], data[train_size:len(data), :]
    return train, test


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

humidity_trainX, humidity_trainY = create_dataset(humidity_train, look_back)
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


def reshape_data_for_lstm(data):
    return np.reshape(data, (data.shape[0], 1, data.shape[1]))


temp_trainX, temp_testX = map(reshape_data_for_lstm, [temp_trainX, temp_testX])
humidity_trainX, humidity_testX = map(
    reshape_data_for_lstm, [humidity_trainX, humidity_testX])
soil_moisture_trainX, soil_moisture_testX = map(
    reshape_data_for_lstm, [soil_moisture_trainX, soil_moisture_testX])
uv_trainX, uv_testX = map(reshape_data_for_lstm, [uv_trainX, uv_testX])
rain_trainX, rain_testX = map(reshape_data_for_lstm, [rain_trainX, rain_testX])

# Create and train LSTM models
temp_model = create_and_train_lstm_model(input_shape=(1, look_back))
humidity_model = create_and_train_lstm_model(input_shape=(1, look_back))
soil_moisture_model = create_and_train_lstm_model(input_shape=(1, look_back))
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


def invert_predictions(trainPredict, trainY, testPredict, testY):
    trainPredict = scaler.inverse_transform(trainPredict)
    trainY = scaler.inverse_transform([trainY])
    testPredict = scaler.inverse_transform(testPredict)
    testY = scaler.inverse_transform([testY])
    return trainPredict, trainY, testPredict, testY


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


def calculate_rmse(actual, predicted):
    return np.sqrt(mean_squared_error(actual[0], predicted[:, 0]))


temp_trainScore = calculate_rmse(temp_trainY, temp_trainPredict)
print('Temp train Score: %.2f RMSE' % temp_trainScore)
temp_testScore = calculate_rmse(temp_testY, temp_testPredict)
print('Temp test Score: %.2f RMSE' % temp_testScore)

humidity_trainScore = calculate_rmse(humidity_trainY, humidity_trainPredict)
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

# Plot predictions
plot_predictions(temp, temp_trainPredict, temp_testPredict, look_back)
plot_predictions(humidity, humidity_trainPredict,
                 humidity_testPredict, look_back)
plot_predictions(soil_moisture, soil_moisture_trainPredict,
                 soil_moisture_testPredict, look_back)
plot_predictions(uv, uv_trainPredict, uv_testPredict, look_back)
plot_predictions(rain, rain_trainPredict, rain_testPredict, look_back)
