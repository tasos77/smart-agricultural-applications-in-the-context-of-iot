![MasterThesisArchitecture2](https://github.com/user-attachments/assets/378a50c3-e4e4-4272-ba65-b41ccc832f79)

# Smart Agricultural applications in the context of IoT

This project implements a smart system based on IoT technologies. The functions of the present system are to record, inform and warn a farmer about the status of his crop and then using machine learning algorithms to predict upcoming events in order to avoid consumption of unnecessary resources.

The components of the system are the following:

- Controller
- ThingsBoard
- Middleware Server
- Forecast Server
- MLFlow Server
- Frontend App

In order to use this project you have follow some steps in order to setup every component.

## Setup

### ThingBoard

1. Download the ThingsBoard Platform from the offocial site as docker container `docker pull thingsboard/tb-postgres`.
2. Follow the official instructions in order to setup ThingsBoard localy. <https://hub.docker.com/r/thingsboard/tb-postgres/>
3. Follow the steps in official [docs](https://thingsboard.io/docs/getting-started-guides/helloworld/) in order to:
   - Setup mail provier by using the Admin panel.
   - Create a device by using the Tenant panel.
   - Create a device shared side attribute named `watering`.
   - Create a device client side attribute named `water_pump`.
   - Optional steps:
     - Create alarms by using the rule chain engine.
     - Create a dashboard in dashboards page in order to monitor the receiving measurements.

### Controller

The controller firmware uses the platformIO template.

1. Download the PlatformIO plugin for your favorite editor.
2. Import the PlatformIO project from the controller folder.
3. Install the requiered depedencies (platformio.ini file).
4. Change the following cont vars based on your local network and the ThingsBoard device id.

```
const char *wifi_ssid = "";
const char *wifi_pass = "";
const char *mqttServer = "";
const char *mqttUsername = "";
```

5. Burn the firmware into your controller chip by using the PlatformIO internal tool or by hand if you like.

### Middleware Server

1. Download node.js into your system.
2. Navigate to TbApi folder.
3. Create a .env file according to .env.template..
4. Download the project depedencies by using your favorite package manager:
   npm

```
npm install
```

yarn

```
yarn install
```

4. Then run the project by typing
   npm

```
npm run start
```

yarn

```
yarn start
```

### Frontend App

2. Navigate to WebApp folder.
3. Create a .env file according to .env.template..
4. Download the project depedencies by using your favorite package manager:
   npm

```
npm install
```

yarn

```
yarn install
```

4. Then run the project by typing
   npm

```
npm run dev
```

yarn

```
yarn dev
```

### Forecast Server

1. Download Python3 into your system.
2. Navigate to TimeseriesForecastApp folder.
3. Open the flask_app.py file.
4. Change the request address according to your middleware server address:

```
response = requests.get("http://{middlewareServerAddress}/trainData",...)
```

5. Download the MLflow Service by following the official [docs](https://mlflow.org/docs/latest/getting-started/index.html).
6. Start the MLflow Service by typing

```
mlflow server --host 127.0.0.1 --port 8080
```

7. Install the project dependecies by typing:

```
pip install -r requirements.txt -t <path-to-the-lib-directory>
```

8. Run the project by typing:

```
python flask_app.py
```

- If you want to test the forecast server app you can tring the following command:

```
curl -X POST http://127.0.0.1:5000/predict -H "Content-Type:application/json" -d '[{"timestamp": 10, "temperature": 15, "humidity": 30, "soilMoisture": 10},{"timestamp": 10, "temperature": 15, "humidity": 30, "soilMoisture": 10},{"timestamp": 10, "temperature": 15, "humidity": 30, "soilMoisture": 10}]'
```

> [!NOTE]
> You could use the docker engine in order to run the some of the components.
> Simply nagivate into each folder that contains a docke-compose file and type
>
> ```
> docker-compose up -d
> ```

<h3 align="left">Languages and Tools:</h3>
<p align="left">
    <a href="https://isocpp.org" target="_blank" rel="noreferrer">
    <img src="https://img.icons8.com/?size=100&id=40669&format=png&color=000000"
    alt="c++" width="40" height="40" /></a>
    <a href="https://www.python.org" target="_blank" rel="noreferrer">
    <img src="https://img.icons8.com/?size=100&id=13441&format=png&color=000000"
    alt="python" width="40" height="40" /></a>
    <a href="https://www.typescriptlang.org" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" alt="ts" width="40" height="40"
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/></a>
    <a href="https://nuxt.com" target="_blank" rel="noreferrer">
    <img src="https://avatars.githubusercontent.com/u/23360933?s=48&v=4" alt="nuxtjs" width="40" height="40"/></a>
    <a href="https://vuejs.org/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original-wordmark.svg" alt="vuejs" width="40" height="40"/></a>
    <a href="https://vuetifyjs.com/en/" target="_blank" rel="noreferrer"> <img src="https://bestofjs.org/logos/vuetify.svg" alt="vuetify" width="40" height="40"/></a>
    <a href="https://www.docker.com/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/></a>
    </p>
