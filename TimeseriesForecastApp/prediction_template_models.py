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

# [[[temp1],[temp2],[temp3],[temp4],[temp5]]] [temp6]
# [[[temp2],[temp3],[temp4],[temp5],[temp6]]] [temp7]
# [[[temp3],[temp4],[temp5],[temp6],[temp7]]] [temp8]

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

############ results ############
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


temp_df = pd.DataFrame({'Temperature': temp})
temp_df['Seconds'] = temp_df.index.map(pd.Timestamp.timestamp)

day = 60*60*24
year = 365.2425*day

temp_df['Day sin'] = np.sin(temp_df['Seconds'] * (2*np.pi/day))
temp_df['Day cos'] = np.con(temp_df['Seconds'] * (2*np.pi/day))

temp_df['Year sin'] = np.sin(temp_df['Seconds'] * (2*np.pi/year))
temp_df['Year cos'] = np.cos(temp_df['Seconds'] * (2*np.pi/year))

temp_df.head()

temp_df = temp_df.drop('Seconds', axis=1)


# [[[temp1,day_sin1],[temp2,day_sin2],[temp3,day_sin3],[temp4,day_sin4],[temp5,day_sin5]]] [temp6]
# [[[temp2,day_sin2],[temp3,day_sin3],[temp4,day_sin4],[temp5,day_sin5],[temp6,day_sin6]]] [temp7]
# [[[temp3,day_sin3],[temp4,day_sin4],[temp5,day_sin5],[temp6,day_sin6],[temp7,day_sin7]]] [temp8]

def df_to_X_y2(df, window_size=6):
    df_as_np = df.to_numpy()
    X = []
    y = []
    for i in range(len(df_as_np)-window_size):
        row = [r for r in df_as_np[i:i+window_size]]
        X.append(row)
        label = df_as_np[i+window_size][0]  # 0 index bcs we want only the temp
        y.append(label)
    return np.array(X), np.array(y)


X2, y2 = df_to_X_y2(temp_df)
X2.shape, y2.shape

X2_train, y2_train = X2[:60000], y2[:60000]
X2_val, y2_val = X2[60000:65000], y2[60000:65000]
X2_test, y2_test = X2[65000:], y2[65000:]

print(X2_train.shape, y2_train.shape, X2_val.shape,
      y2_val.shape, X2_test.shape, y2_test.shape)


temp_training_mean = np.mean(X2_train[:, :, 0])
temp_training_std = np.std(X2_train[:, :, 0])


def preprocess(X):
    X[:, :, 0] = (X[:, :, 0] - temp_training_mean)/temp_training_std
    return X


preprocess(X2_train)
preprocess(X2_val)
preprocess(X2_test)


model4 = Sequential()
model4.add(InputLayer((6, 5)))  # 6 steps , 5 vars of trust
model4.add(LSTM(64))
model4.add(Dense(8, 'relu'))
model4.add(Dense(1, 'linear'))
model4.summary()

cp4 = ModelCheckpoint('model4/', save_best_only=True)
model4.compile(loss=MeanSquaredError(), optimizer=Adam(
    learning_rate=0.0001), metrics=[RootMeanSquaredError()])

model4.fit(X2_train, y2_train, validation_data=(
    X2_val, y2_val), epochs=10, callbacks=[cp4])

plot_predictions1(model4, X2_test, y2_test)


########## predict pressure too ##########

p_temp_df = pd.concat([df['p (mbar)'], temp_df], axis=1)
p_temp_df.head()


def df_to_X_y3(df, window_size=7):
    df_as_np = df.to_numpy()
    X = []
    y = []
    for i in range(len(df_as_np)-window_size):
        row = [r for r in df_as_np[i:i+window_size]]
        X.append(row)
        # 0 index bcs we want only the temp
        label = [df_as_np[i+window_size][0], df_as_np[i+window_size][1]]
        y.append(label)
    return np.array(X), np.array(y)


X3, y3 = df_to_X_y3(p_temp_df)
X3.shape, y3.shape

X3_train, y3_train = X3[:60000], y3[:60000]
X3_val, y3_val = X3[60000:65000], y3[60000:65000]
X3_test, y3_test = X3[65000:], y3[65000:]

print(X3_train.shape, y3_train.shape, X3_val.shape,
      y3_val.shape, X3_test.shape, y3_test.shape)

p_training_mean3 = np.mean(X3_train[:, :, 0])
p_training_std3 = np.std(X3_train[:, :, 0])

temp_training_mean3 = np.mean(X3_train[:, :, 1])
temp_training_std3 = np.std(X3_train[:, :, 1])


def preprocess3(X):
    X[:, :, 0] = (X[:, :, 0] - p_training_mean3) / p_training_std3
    X[:, :, 1] = (X[:, :, 1] - temp_training_mean3) / temp_training_std3


def preprocess_output3(y):
    y[:, 0] = (y[:, 0] - p_training_mean3) / p_training_std3
    y[:, 1] = (y[:, 0] - temp_training_mean3) / temp_training_std3
    return y


preprocess3(X3_train)
preprocess3(X3_val)
preprocess3(X3_test)

preprocess_output3(y3_train)
preprocess_output3(y3_val)
preprocess_output3(y3_test)

model5 = Sequential()
model5.add(InputLayer((7, 6)))
model5.add(LSTM(64))
model5.add(Dense(8, 'relu'))
model5.add(Dense(2, 'linear'))
model5.summary()


cp5 = ModelCheckpoint('model5/', save_best_only=True)
model4.compile(loss=MeanSquaredError(), optimizer=Adam(
    learning_rate=0.0001), metrics=[RootMeanSquaredError()])

model5.fit(X3_train, y3_train, validation_data=(
    X3_val, y3_val), epochs=10, callbacks=[cp5])


def plot_predictions2(model, X, y, start=0, end=100):
    predictions = model.predict(X)
    p_preds, temp_preds = predictions[:, 0], predictions[:, 1]
    p_actuals, temp_actuals = y[:, 0], y[:, 1]
    df = pd.DataFrame(data={'Temperature Predictions': temp_preds,
                            'Temperature Actuals': temp_actuals,
                            'Pressure Predictions': p_preds,
                            'Pressure Actuals': p_actuals
                            })
    plt.plot(df['Temperature Predictions'][start:end])
    plt.plot(df['Temperature Actuals'][start:end])
    plt.plot(df['Pressure Predictions'][start:end])
    plt.plot(df['Pressure Predictions'][start:end])
    return df[start:end]


plot_predictions2(model5, X3_test, y3_test)


def postprocess_temp(arr):
    arr = (arr*temp_training_std3) + temp_training_mean3
    return arr


def postprocess_p(arr):
    arr = (arr*p_training_std3) + p_training_mean3
    return arr


def plot_predictions3(model, X, y, start=0, end=100):
    predictions = model.predict(X)
    p_preds, temp_preds = postprocess_p(
        predictions[:, 0]), postprocess_temp(predictions[:, 1])
    p_actuals, temp_actuals = postprocess_p(y[:, 0]), postprocess_temp(y[:, 1])
    df = pd.DataFrame(data={'Temperature Predictions': temp_preds,
                            'Temperature Actuals': temp_actuals,
                            'Pressure Predictions': p_preds,
                            'Pressure Actuals': p_actuals
                            })
    plt.plot(df['Temperature Predictions'][start:end])
    plt.plot(df['Temperature Actuals'][start:end])
    plt.plot(df['Pressure Predictions'][start:end])
    plt.plot(df['Pressure Predictions'][start:end])
    return df[start:end]


post_processed_df = plot_predictions3(model5, X3_test, y3_test)

start, end = 0, 100
plt.plot(post_processed_df['Temperature Predictions'][start:end])
plt.plot(post_processed_df['Temperature Actuals'][start:end])

plt.plot(post_processed_df['Pressure Predictions'][start:end])
plt.plot(post_processed_df['Pressure Actuals'][start:end])
