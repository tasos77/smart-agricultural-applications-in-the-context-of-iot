#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHTesp.h"
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

// Set up LCD
LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display

// DHT set up
DHTesp dht;

// MQTT credentials
const char *wifi_ssid = "COSMOTE-ts7hsv";
const char *wifi_pass = "thxrfcexh5v4b64g";
const char *mqttServer = "192.168.1.8";
const char *mqttUsername = "C117HUVxOGObTZWBNKml";
const char *id = "";
const char *mqttPass = "";

// parameters for using non-blocking delay
unsigned long previousMillis = 0;
const long interval = 3000;

// MQTT message buffer
String msgStr = "";

// Ethernet and MQTT related objects
WiFiClient espWifi;
PubSubClient mqttClient(espWifi);

int sensePin = A0; // This is the Arduino Pin that will read the sensor output
int sensorInput;   // The variable we will use to store the sensor input
double temp;       // The variable we will use to store temperature in degrees.
double voltage;    // The variable we will use to store voltage output

// Set up wifi function
void setupWifi()
{

  WiFi.begin(wifi_ssid, wifi_pass);
  Serial.println("Connecting...");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

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
  Wire.begin(2, 0);

  //  initialize the lcd
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("print");
  lcd.setCursor(0, 1);
  lcd.print("some");
  lcd.setCursor(0, 2);
  lcd.print("text");
  lcd.setCursor(0, 3);
  lcd.print("here");

  // pinMode(D1, OUTPUT);
  // pinMode(DHTPIN, INPUT);

  // Start the Serial Port at 921600 baud
  Serial.begin(921600);
  Serial.println();

  // start wifi set up
  setupWifi();

  // set the MQTT server to the server stated above ^
  mqttClient.setServer(mqttServer, 1883);

  // start DHT
  dht.setup(D2, DHTesp::DHT11);

  // defining function which will be called when message is received
  // mqttClient.setCallback(callback);
}
void loop()
{

  digitalWrite(D1, HIGH);
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
      Serial.println("<---------------------------------------------------->");
      Serial.print(F("Humidity: "));
      Serial.print(humidity);
      Serial.println("%");
      Serial.print(F("Temperature: "));
      Serial.print(temperatureC);
      Serial.print(F("°C "));
      Serial.print(temperatureF);
      Serial.println(F("°F "));
      Serial.println("******************");
      Serial.print(F("Heat index: "));
      Serial.print(heatIndexC);
      Serial.print(F("°C "));
      Serial.print(heatIndexF);
      Serial.println(F("°F "));
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
      lcd.print("Heat index:");
      lcd.print(heatIndexC);
      lcd.print((char)223);
      lcd.print("C");

      // // read sensor
      // sensorInput = analogRead(sensePin);   // read the analog sensor and store it
      // voltage = sensorInput * (3.3 / 1024); // find percentage of input reading
      // // print out the voltage
      // Serial.print(voltage);
      // Serial.println(" volts");

      // // now print out the temperature
      // float temperatureC = (voltage - 0.5) * 100; // converting from 10 mv per degree wit 500 mV offset
      //                                             // to degrees ((voltage - 500mV) times 100)
      // Serial.print(temperatureC);
      // Serial.println(" degrees C");

      // // now convert to Fahrenheit
      // float temperatureF = (temperatureC * 9.0 / 5.0) + 32.0;
      // Serial.print(temperatureF);
      // Serial.println(" degrees F");

      msgStr = "{\"temperature\":" + String(temperatureC) + ",\"humidity\":" + String(humidity) + "}";

      byte arrSize = msgStr.length() + 1;
      char msg[arrSize];

      Serial.print("Publish data: ");
      Serial.println(msgStr);
      msgStr.toCharArray(msg, arrSize);

      mqttClient.publish("v1/devices/me/telemetry", msg);
      msgStr = "";

      delay(50);
    }
  }
  digitalWrite(D1, LOW);
  // Dont overload the server!
  delay(3000);
}
