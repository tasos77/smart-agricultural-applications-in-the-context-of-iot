from sklearn.metrics import mean_squared_error as mse
from keras.models import load_model
from keras.losses import MeanSquaredError
from keras.metrics import RootMeanSquaredError
from keras.callbacks import ModelCheckpoint
from keras.layers import *
from keras.models import Sequential
from keras.optimizers import Adam
import tensorflow as tf
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

zip_path = tf.keras.utils.get_file(
    origin='https://storage.googleapis.com/tensorflow/tf-keras-datasets/jena_climate_2009_2016.csv.zip',
    fname='jena_climate_2009_2016.csv.zip',
    extract=True
)
csv_path, _ = os.path.splitext(zip_path)

df = pd.read_csv(csv_path)

df = df[5::6]

df.index = pd.to_datetime(df['Date Time'], format='%d.%m.%Y %H:%M:%S')


temp = df[
    'T (degC)'
]

# plt.plot(temp)
# plt.show()

# [[[1],[2],[3],[4],[5]]] [6]
# [[[2],[3],[4],[5],[6]]] [7]
# [[[3],[4],[5],[6],[7]]] [8]

# window size = the size of X input matrix


def df_to_X_y(df, window_size=5):
    df_as_np = df.to_numpy()
    X = []
    y = []
    for i in range(len(df_as_np)-window_size):
        row = [[a] for a in df_as_np[i:i+5]]
        X.append(row)
        label = df_as_np[i+5]
        y.append(label)
    return np.array(X), np.array(y)


WINDOW_SIZE = 5

X, y = df_to_X_y(temp, WINDOW_SIZE)

# print(X.shape, y.shape)

X_train, y_train = X[:60000], y[:60000]
X_val, y_val = X[60000:65000], y[60000:65000]
X_test, y_test = X[65000:], y[65000:]

print(X_train.shape, y_train.shape, X_val.shape,
      y_val.shape, X_test.shape, y_test.shape)

# create model
model1 = Sequential()
model1.add(InputLayer((5, 1)))
model1.add(LSTM(64))
model1.add(Dense(8, 'relu'))
model1.add(Dense(1, 'linear'))

model1.summary()

# the only the lowest validation lost
cp = ModelCheckpoint('model1/', save_best_only=True)
model1.compile(loss=MeanSquaredError(), optimizer=Adam(
    learning_rate=0.0001), metrics=[RootMeanSquaredError()])

model1.fit(X_train, y_train, validation_data=(
    X_val, y_val), epochs=10, callbacks=[cp])


model1 = load_model('model1/')

############ train results ############
train_predictions = model1.predict(X_train).flatten()
train_results = pd.DataFrame(
    data={'Train Predictions': train_predictions, 'Actuals': y_train})

plt.plot(train_results['Train Predictions'][:100])
plt.plot(train_results['Actuals'][:100])
plt.show()

############ validation results ############
val_predictions = model1.predict(X_val).flatten()
val_results = pd.DataFrame(
    data={'Val Predictions': val_predictions, 'Actuals': y_val})

plt.plot(val_results['Val Predictions'][:100])
plt.plot(val_results['Actuals'][:100])
plt.show()

############ test results ############
test_predictions = model1.predict(X_test).flatten()
test_results = pd.DataFrame(
    data={'Test Predictions': test_predictions, 'Actuals': y_test})

plt.plot(test_results['Test Predictions'][:100])
plt.plot(test_results['Actuals'][:100])
plt.show()


#################### MULTIVARIABLE PREDICTION ########################


def plot_predictions1(model, X, y, start=0, end=100):
    predictions = model.predict(X).flatten()
    df = pd.DataFrame(data={'Predictions': predictions, 'Actuals': y})
    plt.plot(df['Predictions'][start:end])
    plt.plot(df['Actuals'][start:end])
    return df, mse(y, predictions)


plot_predictions1(model1, X_test, y_test)


# create model2 Conv1D
model2 = Sequential()
model2.add(InputLayer((5, 1)))
model2.add(Conv1D(64, kernel_size=2))
model2.add(Flatten())
model2.add(Dense(8, 'relu'))
model2.add(Dense(1, 'linear'))
model2.summary()


cp2 = ModelCheckpoint('model2/', save_best_only=True)
model2.compile(loss=MeanSquaredError(), optimizer=Adam(
    learning_rate=0.0001), metrics=[RootMeanSquaredError()])

model2.fit(X_train, y_train, validation_data=(
    X_val, y_val), epochs=10, callbacks=[cp2])


# create model3 GRU
model3 = Sequential()
model3.add(InputLayer((5, 1)))
model3.add(GRU(64))
model3.add(Dense(8, 'relu'))
model3.add(Dense(1, 'linear'))
model3.summary()

cp3 = ModelCheckpoint('model3/', save_best_only=True)
model3.compile(loss=MeanSquaredError(), optimizer=Adam(
    learning_rate=0.0001), metrics=[RootMeanSquaredError()])

model3.fit(X_train, y_train, validation_data=(
    X_val, y_val), epochs=10, callbacks=[cp3])
