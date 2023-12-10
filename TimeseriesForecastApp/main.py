# import mlflow
# from mlflow.models import infer_signature

# import pandas as pd
# from sklearn import datasets
# from sklearn.model_selection import train_test_split
# from sklearn.linear_model import LogisticRegression
# from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# from sklearn.metrics import mean_squared_error as mse
# from keras.models import load_model
# from keras.losses import MeanSquaredError
# from keras.metrics import RootMeanSquaredError
# from keras.callbacks import ModelCheckpoint
# from keras.layers import *
# from keras.models import Sequential
# from keras.optimizers import Adam
# import tensorflow as tf
# import os

# import numpy as np
# import matplotlib.pyplot as plt

# os.environ["CUDA_VISIBLE_DEVICES"] = "-1"


# zip_path = tf.keras.utils.get_file(
#     origin='https://storage.googleapis.com/tensorflow/tf-keras-datasets/jena_climate_2009_2016.csv.zip',
#     fname='jena_climate_2009_2016.csv.zip',
#     extract=True
# )
# csv_path, _ = os.path.splitext(zip_path)

# df = pd.read_csv(csv_path)

# df = df[5::6]

# df.index = pd.to_datetime(df['Date Time'], format='%d.%m.%Y %H:%M:%S')


# temp = df[
#     'T (degC)'
# ]


# def df_to_X_y(df, window_size=5):
#     df_as_np = df.to_numpy()
#     X = []
#     y = []
#     for i in range(len(df_as_np)-window_size):
#         row = [[a] for a in df_as_np[i:i+5]]
#         X.append(row)
#         label = df_as_np[i+5]
#         y.append(label)
#     return np.array(X), np.array(y)


# WINDOW_SIZE = 5

# X, y = df_to_X_y(temp, WINDOW_SIZE)

# # # Load the Iris dataset
# # X, y = datasets.load_iris(return_X_y=True)

# X_train, y_train = X[:60000], y[:60000]
# X_val, y_val = X[60000:65000], y[60000:65000]
# X_test, y_test = X[65000:], y[65000:]

# # # Split the data into training and test sets
# # X_train, X_test, y_train, y_test = train_test_split(
# #     X, y, test_size=0.2, random_state=42
# # )

# print(X_train.shape, y_train.shape, X_val.shape,
#       y_val.shape, X_test.shape, y_test.shape)

# # # Define the model hyperparameters
# # params = {
# #     "solver": "lbfgs",
# #     "max_iter": 1000,
# #     "multi_class": "auto",
# #     "random_state": 8888,
# # }

# # # Train the model
# # lr = LogisticRegression(**params)
# # lr.fit(X_train, y_train)

# # create model
# model1 = Sequential()
# model1.add(InputLayer((5, 1)))
# model1.add(LSTM(64))
# model1.add(Dense(8, 'relu'))
# model1.add(Dense(1, 'linear'))
# model1.summary()

# # the only the lowest validation lost
# cp = ModelCheckpoint('model1/', save_best_only=True)
# model1.compile(loss=MeanSquaredError(), optimizer=Adam(
#     learning_rate=0.0001), metrics=[RootMeanSquaredError()])

# model1.fit(X_train, y_train, validation_data=(
#     X_val, y_val), epochs=10, callbacks=[cp])


# model1 = load_model('model1/')


# # Predict on the test set
# # y_pred = model1.predict(X_test)
# val_predictions = model1.predict(X_val).flatten()

# # Calculate metrics
# # accuracy = accuracy_score(y_test, y_pred)

# # Set our tracking server uri for logging
# mlflow.set_tracking_uri(uri="http://127.0.0.1:8080")

# # Create a new MLflow Experiment
# mlflow.set_experiment("MLflow Quickstart")

# # Start an MLflow run
# with mlflow.start_run():
#     # Log the hyperparameters
#     # mlflow.log_params(params)

#     # Log the loss metric
#     mlflow.log_metric("predicted_temp", val_predictions)

#     # Set a tag that we can use to remind ourselves what this run was for
#     mlflow.set_tag("Training Info", "Basic LR model for iris data")

#     # Infer the model signature
#     signature = infer_signature(X_train,  model1.predict(X_val).flatten())

#     # Log the model
#     model_info = mlflow.sklearn.log_model(
#         sk_model=lr,
#         artifact_path="iris_model",
#         signature=signature,
#         input_example=X_train,
#         registered_model_name="tracking-quickstart",
#     )


# # Load the model back for predictions as a generic Python Function model
# loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)

# predictions = loaded_model.predict(X_test)

# iris_feature_names = datasets.load_iris().feature_names

# result = pd.DataFrame(X_test, columns=iris_feature_names)
# result["actual_class"] = y_test
# result["predicted_class"] = predictions

# result[:4]


from flask import Flask, request, jsonify
import mlflow
import mlflow.tensorflow
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense
from keras.losses import MeanSquaredError
from keras.metrics import RootMeanSquaredError
from keras.callbacks import ModelCheckpoint
from keras.models import load_model
from keras.optimizers import Adam
from keras.layers import *
import tensorflow as tf
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

# zip_path = tf.keras.utils.get_file(
#     origin='https://storage.googleapis.com/tensorflow/tf-keras-datasets/jena_climate_2009_2016.csv.zip',
#     fname='jena_climate_2009_2016.csv.zip',
#     extract=True
# )
# csv_path, _ = os.path.splitext(zip_path)

# df = pd.read_csv(csv_path)

# df = df[5::6]

# df.index = pd.to_datetime(df['Date Time'], format='%d.%m.%Y %H:%M:%S')


# temp = df[
#     'T (degC)'
# ]


# def df_to_X_y(df, window_size=5):
#     df_as_np = df.to_numpy()
#     X = []
#     y = []
#     for i in range(len(df_as_np)-window_size):
#         row = [[a] for a in df_as_np[i:i+5]]
#         X.append(row)
#         label = df_as_np[i+5]
#         y.append(label)
#     return np.array(X), np.array(y)


# WINDOW_SIZE = 5

# X, y = df_to_X_y(temp, WINDOW_SIZE)


# X_train, y_train = X[:60000], y[:60000]
# X_val, y_val = X[60000:65000], y[60000:65000]
# X_test, y_test = X[65000:], y[65000:]

# print(X_train.shape, y_train.shape, X_val.shape,
#       y_val.shape, X_test.shape, y_test.shape)

# # create model
# model1 = Sequential()
# model1.add(InputLayer((5, 1)))
# model1.add(LSTM(64))
# model1.add(Dense(8, 'relu'))
# model1.add(Dense(1, 'linear'))

# model1.summary()

# # the only the lowest validation lost
# cp = ModelCheckpoint('model1/', save_best_only=True)
# model1.compile(loss=MeanSquaredError(), optimizer=Adam(
#     learning_rate=0.0001), metrics=[RootMeanSquaredError()])

# model1.fit(X_train, y_train, validation_data=(
#     X_val, y_val), epochs=10, callbacks=[cp])


# # model1 = load_model('model1/')
# train_predictions = model1.predict(X_train).flatten()
# train_results = pd.DataFrame(
#     data={'Train Predictions': train_predictions, 'Actuals': y_train})
##################################################################################

app = Flask(__name__)

# Load the trained model
# model1 = mlflow.tensorflow.load_model('mlflow-model')

# Assuming you have a scaler saved during training
scaler = MinMaxScaler()  # Load your scaler accordingly

sequence_length = 10  # Adjust as needed
forecast_horizon = 5  # Adjust as needed


@app.route('/predict', methods=['POST'])
def predict():
    try:
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

        # only the lowest validation lost
        cp = ModelCheckpoint('model1/', save_best_only=True)
        model1.compile(loss=MeanSquaredError(), optimizer=Adam(
            learning_rate=0.0001), metrics=[RootMeanSquaredError()])

        model1.fit(X_train, y_train, validation_data=(
            X_val, y_val), epochs=10, callbacks=[cp])

        # model1# = load_model('model1/')d
        # train_predictions = model1.predict(X_train).flatten()
        # train_results = pd.DataFrame(
        #    data={'Train Predictions': train_predictions, 'Actuals': y_train})

        # Create response JSON
        response_data = {
            # 'predicted_timestamps': predicted_timestamps.strftime('%Y-%m-%d %H:%M:%S').tolist(),
            # train_predictions.tolist()
            # 'predicted_temperature':
            'predict': 'hello'
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({'error': str(e)})


# def create_sequences(df_as_np, window_size=5):
#     df_as_np = df.to_numpy()
#     X = []
#     y = []
#     for i in range(len(df_as_np)-window_size):
#         row = [[a] for a in df_as_np[i:i+5]]
#         X.append(row)
#         label = df_as_np[i+5]
#         y.append(label)
#     return np.array(X), np.array(y)
    # sequences = []
    # for i in range(len(data) - sequence_length):
    #     sequence = data[i:i+sequence_length]
    #     target = data[i+sequence_length:i+sequence_length+1]
    #     sequences.append((sequence, target))
    # return np.array([item[0] for item in sequences]), np.array([item[1] for item in sequences])


def predict_temperature(model, input_sequence):
    train_predictions = model.predict(input_sequence).flatten()
    # prediction = model.predict(input_sequence)
    return train_predictions


if __name__ == '__main__':
    app.run(port=5000)
