#include <Arduino.h>
#include "DHTesp.h"
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
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
// const string texts to print
const String temperature_text = "Temp: ";
const String humidity_text = "Humi: ";
const String rain_text = "Rain: ";
const String soil_moisture_text = "Soil: ";
const String uv_text = "UV  : ";
// const string units to print
const String temperature_unit = "°C";
const String humidity_unit = "%";
const String rain_unit = "%";
const String soil_moisture_unit = "%";
const String uv_unit = "";
// thresholds
const int humidity_upper_threshold = 60;
const int humidity_lower_threshold = 40;
const int soil_moisture_upper_threshold = 75;
const int soil_moisture_lower_threshold = 50;
const int rain_lower_threshold = 30;

// parameters for using non-blocking delay
unsigned long previousMillis = 0;
const long interval = 3000;
// Ethernet and MQTT related objects
WiFiClient espWifi;
PubSubClient mqttClient(espWifi);
// print measurements in serial func
void PrintMeasurementInSerial(String text, String unit, float value)
{
  Serial.print(text);
  Serial.print(value);
  Serial.println(unit);
}
// print measurements in LCD func
void PrintMeasurementsInLCD(float temperature, float humidity, float rain, float soil, float uv)
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temp:");
  lcd.print(temperature);
  lcd.print((char)223);
  lcd.print("C");

  lcd.setCursor(0, 1);
  lcd.print("Humi:");
  lcd.print(humidity);
  lcd.print("%");

  lcd.setCursor(0, 2);
  lcd.print("Soil:");
  lcd.print(soil);
  lcd.print("%");

  lcd.setCursor(0, 3);
  lcd.print("Rain:");
  lcd.print(rain);
  lcd.print("%");
  lcd.print("  ");
  lcd.print("UV:");
  lcd.print(uv);
}

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
// publish telemetry func
void PublishTelemetryData(float temperature, float humidity, float rain, float soil, float uv)
{
  String telemetries_msg = "{\"temperature\":" + String(temperature) + ",\"humidity\":" + String(humidity) + ",\"rain\":" + String(rain) + ",\"uv\":" + String(uv) + ",\"soilMoisture\":" + String(soil) + "}";
  byte arrSize = telemetries_msg.length() + 1;
  char msg[arrSize];
  telemetries_msg.toCharArray(msg, arrSize);
  mqttClient.publish("v1/devices/me/telemetry", msg);
  telemetries_msg = "";
}
// publish pump state func
void PublishWaterPumpState(String state)
{
  String pump_state_msg = "{\"pump_state\":" + state + " }";
  byte arrSize = pump_state_msg.length() + 1;
  char msg[arrSize];
  pump_state_msg.toCharArray(msg, arrSize);
  mqttClient.publish("v1/devices/me/attributes", msg);
  pump_state_msg = "";
}
// start pump
void StartWaterPump()
{
  digitalWrite(waterPumpRelay, HIGH);
}
// stop pump
void StopWaterPump()
{
  digitalWrite(waterPumpRelay, LOW);
}
// monitor sensor
float MonitorRainSensor()
{
  return 100 - map(analogRead(rainSensor), 0, 4095, 0, 100);
}
// monitor sensor
float MonitorSoilSensor()
{
  return 100 - map(analogRead(soilSensor), 0, 4095, 0, 100);
}
// monitor sensor
float MonitorHumiditySensor()
{
  return dht.getHumidity();
}
// check conditions
boolean CheckWateringConditions()
{
  if (MonitorHumiditySensor() > humidity_upper_threshold || MonitorSoilSensor() > soil_moisture_upper_threshold || MonitorRainSensor() > rain_lower_threshold)
  {
    return false;
  }
  else
  {
    return true;
  }
}
// check interruption
boolean CheckIfWateringInterrupted()
{
  return MonitorRainSensor() >= rain_lower_threshold;
}
// callback function which will be called when message is received
void callback(char *topic, byte *payload, unsigned int length)
{
  int counter = 0;
  if (CheckWateringConditions())
  {
    PublishWaterPumpState("started");
    while (counter < 10)
    {
      if (CheckWateringConditions())
      {
        StartWaterPump();
        counter++;
        delay(1000);
      }
      else
      {
        break;
      }
    }
    StopWaterPump();
    boolean rain_interruption = CheckIfWateringInterrupted();
    if (rain_interruption)
    {
      PublishWaterPumpState("interrupted");
    }
    else
    {
      PublishWaterPumpState("stopped");
    }
  }
}

void setup()
{
  Serial.begin(921600);
  pinMode(redLedPin, OUTPUT);
  pinMode(greenLenPin, OUTPUT);
  pinMode(waterPumpRelay, OUTPUT);
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
  // set the MQTT server
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
    // read temperature
    float temperature = dht.getTemperature();
    // read humidity
    float humidity = dht.getHumidity();
    // read rain
    float rain_in_percentage = 100 - map(analogRead(rainSensor), 0, 4095, 0, 100);
    // read soil sensor
    float soil_in_percentage = 100 - map(analogRead(soilSensor), 0, 4095, 0, 100);
    // read uv
    float uv = (analogRead(uvSensor) * (3.3 / 4095)) / .1;
    // print measurements in serial
    PrintMeasurementInSerial(temperature_text, temperature_unit, temperature);
    PrintMeasurementInSerial(humidity_text, humidity_unit, humidity);
    PrintMeasurementInSerial(rain_text, rain_unit, rain_in_percentage);
    PrintMeasurementInSerial(soil_moisture_text, soil_moisture_unit, soil_in_percentage);
    PrintMeasurementInSerial(uv_text, uv_unit, uv);
    Serial.println("<---------------------------------------------------->");
    // print measurements in LCD
    PrintMeasurementsInLCD(temperature, humidity, rain_in_percentage, soil_in_percentage, uv);
    // publish measurements
    PublishTelemetryData(temperature, humidity, rain_in_percentage, soil_in_percentage, uv);
  }

  delay(5000);
}
