#include <Arduino.h>

// humidity/temp sensor, LCD display libs
#include "DHTesp.h"
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
// wifi, mqtt, json libs
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>

// Set up LCD
LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display

// DHT set up
DHTesp dht;

// define pins
#define redLedPin 14
#define greenLenPin 16
#define waterPumpRelay 17
#define humiditySensor 27
#define soilSensor 34
#define uvSensor 36
#define rainSensor 39

// MQTT credentials
const char *wifi_ssid = "COSMOTE-ts7hsv";
const char *wifi_pass = "thxrfcexh5v4b64g";
const char *mqttServer = "192.168.1.9";
const char *mqttUsername = "U9HU1LRFJQ7SKjPNADsI";
const char *id = "";
const char *mqttPass = "";

// MQTT message buffer
String msgStr = "";

// Ethernet and MQTT related objects
WiFiClient espWifi;
PubSubClient mqttClient(espWifi);

// parameters for using non-blocking delay
unsigned long previousMillis = 0;
const long interval = 3000;

// Set up wifi function
void setupWifi()
{

  WiFi.begin(wifi_ssid, wifi_pass);
  Serial.println("Connecting...");

  while (WiFi.status() != WL_CONNECTED)
  {
    digitalWrite(redLedPin, HIGH);
    delay(500);
    Serial.print(".");
    digitalWrite(redLedPin, LOW);
    delay(500);
  }
  Serial.println();
  digitalWrite(redLedPin, LOW);
  digitalWrite(greenLenPin, HIGH);
  Serial.print("Connected IP Address: ");
  Serial.println(WiFi.localIP());
}

// Reconnect function
void reconnect()
{
  while (!mqttClient.connected())
  {
    if (mqttClient.connect(id, mqttUsername, mqttPass))
    {
      Serial.println("MQTT connected");
      mqttClient.subscribe("v1/devices/me/telemetry");
      mqttClient.subscribe("v1/devices/me/attributes");
      Serial.println("Topic subscribed");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.println(mqttClient.state());
      Serial.println("try again in 3 seconds");
      delay(3000);
    }
  }
}

// Callback function which will be called when message is received
void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.println("Attr Update!");
  digitalWrite(waterPumpRelay, HIGH);
  delay(2000);
  digitalWrite(waterPumpRelay, LOW);

  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  Serial.print("Message size: ");
  Serial.println(length);
  Serial.println();
  Serial.println("-----------------");

  // read JSON data
  StaticJsonDocument<256> doc;
  // deserialise it
  deserializeJson(doc, payload, length);
  JsonObject command = doc["command"];

  // get value of led, which will be 1 or 0
  int command_parameters_led = command["parameters"]["led"];

  if (command_parameters_led = 1)
  {
    Serial.println("LED");
    digitalWrite(LED_BUILTIN, HIGH);
  }
  else
  {
    digitalWrite(LED_BUILTIN, LOW);
  }
}

void setup()
{
  Serial.begin(921600);
  pinMode(redLedPin, OUTPUT);
  pinMode(greenLenPin, OUTPUT);
  pinMode(waterPumpRelay, OUTPUT);
  // pinMode(humiditySensor, INPUT);
  // pinMode(rainSensor, INPUT);
  // pinMode(uvSensor, INPUT);
  // pinMode(soilSensor, INPUT);

  // initalize DHT
  dht.setup(humiditySensor, DHTesp::DHT11);

  //  initialize the lcd
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Booting up...");

  // start wifi set up
  setupWifi();

  // set the MQTT server to the server stated above ^
  mqttClient.setServer(mqttServer, 1883);

  // defining function which will be called when message is received
  mqttClient.setCallback(callback);
}

void loop()
{
  if (!mqttClient.connected())
  {
    reconnect();
  }
  mqttClient.loop();
  // read current time
  unsigned long currentMillis = millis();

  // if current time - last time >= 3 secs
  if (currentMillis - previousMillis >= interval)
  {
    previousMillis = currentMillis;

    if (dht.getStatusString() != "OK")
    {
      Serial.println(F("Failed to read from DHT sensor"));
      return;
    }
    else
    {

      // reading temperature or humidity takes about 250 milliseconds
      // sensor readings may also be up to 2 seconds 'old'
      // read humidity
      float humidity = dht.getHumidity();
      // read temperature as Celsius (default)
      float temperatureC = dht.getTemperature();
      // temperature as Fahrenheit
      float temperatureF = dht.toFahrenheit(temperatureC);
      // compute heat index in Celsius
      float heatIndexC = dht.computeHeatIndex(temperatureC, humidity, false);
      // compute heat index in Fahrenheit
      float heatIndexF = dht.computeHeatIndex(temperatureF, humidity, true);

      // read rain
      float rain = analogRead(rainSensor) * (3.3 / 4095);
      float calcedRainVoltage = 3.3 - rain;
      // read soil sensor
      float soilMoisture = analogRead(soilSensor) * (3.3 / 4095);
      float calcedSoilMoistureVoltage = 3.3 - soilMoisture;
      // read uv
      float uvIndex = (analogRead(uvSensor) * (3.3 / 4095)) / .1;

      if (calcedRainVoltage < 1.1)
      {
        Serial.println("Valve on");
      }
      else
      {
        Serial.println("Valve off");
      }

      Serial.println("******************");
      Serial.print(F("Humidity: "));
      Serial.print(humidity);
      Serial.println("%");
      Serial.print(F("Temperature: "));
      Serial.print(temperatureC);
      Serial.print(F("°C "));
      Serial.print(temperatureF);
      Serial.println(F("°F "));
      Serial.print("Rain: ");
      Serial.println(rain);
      Serial.print("UV Index: ");
      Serial.println(uvIndex);
      Serial.print("Soil Moisture: ");
      Serial.println(soilMoisture);
      Serial.println("<---------------------------------------------------->");

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Temp:");
      lcd.print(temperatureC);
      lcd.print((char)223);
      lcd.print("C");

      lcd.setCursor(0, 1);
      lcd.print("Humidity:");
      lcd.print(humidity);
      lcd.print("%");

      lcd.setCursor(0, 2);
      lcd.print("Soil Moisture:");
      lcd.print(calcedSoilMoistureVoltage);

      lcd.setCursor(0, 3);
      lcd.print("Rain:");
      lcd.print(calcedRainVoltage);
      lcd.print(" ");
      lcd.print("UV:");
      lcd.print(uvIndex);

      msgStr = "{\"temperature\":" + String(temperatureC) + ",\"humidity\":" + String(humidity) + ",\"rain\":" + String(calcedRainVoltage) + ",\"uv\":" + String(uvIndex) + ",\"soilMoisture\":" + String(calcedSoilMoistureVoltage) + "}";

      byte arrSize = msgStr.length() + 1;
      char msg[arrSize];

      Serial.print("Publish data: ");
      Serial.println(msgStr);
      msgStr.toCharArray(msg, arrSize);

      mqttClient.publish("v1/devices/me/telemetry", msg);
      msgStr = "";
    }
  }

  delay(5000);
}