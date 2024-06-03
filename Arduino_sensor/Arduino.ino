// Seeeduino LoRaWAN ------------------------------------------------------------
#define PIN_GROVE_POWER 38
#define SerialUSB Serial
 
// LoRaWAN -----------------------------------------------------------------------
#include <LoRaWan.h>
 
// Put your LoRa keys here
#define DevEUI "002A862DA290C679"
#define AppEUI "70B3D57ED002F952"
#define AppKey "1741A4E69973C2AE31754F88DFEA33AC"
 
// CayenneLPP --------------------------------------------------------------------
#include <CayenneLPP.h>  // Include Cayenne Library
CayenneLPP lpp(51);      // Define the buffer size: Keep as small as possible
 
// Sensor Libraries
// sunlight
#include "SI114X.h" 
// temperature
#include "seeed_bme680.h"
#define BME_SCK 13
#define BME_MISO 12
#define BME_MOSI 11
#define BME_CS 10

// Sensor instances
SI114X SI1145 = SI114X();
#define IIC_ADDR  uint8_t(0x76)
Seeed_BME680 bme680(IIC_ADDR);


// SETUP -------------------------------------------------------------------------
// vars
char buffer[256];
void setup(void)
{
  // Setup Serial connection
  delay(5000);
  Serial.begin(115200);
 
  // Powerup Seeeduino LoRaWAN Grove connectors
  pinMode(PIN_GROVE_POWER, OUTPUT);
  digitalWrite(PIN_GROVE_POWER, 1);
 
  // Config LoRaWAN
  lora.init();
 
  memset(buffer, 0, 256);
  lora.getVersion(buffer, 256, 1);
  if (Serial) {
    Serial.print(buffer);
  }
 
  memset(buffer, 0, 256);
  lora.getId(buffer, 256, 1);
  if (Serial) {
    Serial.print(buffer);
  }
 
  // void setId(char *DevAddr, char *DevEUI, char *AppEUI);
  // replace the xxxxxx and the yyyyyy below with the DevEUI and the
  // AppEUI obtained from your registered sensor node and application
  // in The Things Network (TTN). The numbers are hexadecimal strings
  // without any leading prefix like "0x" and must have exactly the
  // same number of characters as given below.
  // lora.setId(NULL, "xxxxxxxxxxxxxxxx", "yyyyyyyyyyyyyyyy");
  lora.setId(NULL, DevEUI, AppEUI);
 
  // setKey(char *NwkSKey, char *AppSKey, char *AppKey);
  // replace the zzzzzz below with the AppKey obtained from your registered
  // application in The Things Network (TTN). The numbers are hexadecimal
  // strings without any leading prefix like "0x" and must have exactly
  // the same number of characters as given below.
  // lora.setKey(NULL, NULL, "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
  lora.setKey(NULL, NULL, AppKey);
 
  lora.setDeciveMode(LWOTAA);
  lora.setDataRate(DR0, EU868);      // DR5 = SF7, DR0 = SF 12
  lora.setAdaptiveDataRate(true);
 
  lora.setChannel(0, 868.1);
  lora.setChannel(1, 868.3);
  lora.setChannel(2, 868.5);
  lora.setChannel(3, 867.1);
  lora.setChannel(4, 867.3);
  lora.setChannel(5, 867.5);
  lora.setChannel(6, 867.7);
  lora.setChannel(7, 867.9);
 
  lora.setDutyCycle(false);
  lora.setJoinDutyCycle(false);
 
  lora.setPower(14);
  lora.setPort(33);
 
  unsigned int nretries;
  nretries = 0;
  while (!lora.setOTAAJoin(JOIN, 20)) {
    nretries++;
    if (Serial) {
      Serial.println((String)"Join failed, retry: " + nretries);
    }
  }
  Serial.println("Join successful!");
}
 
// LOOP --------------------------------------------------------------------
unsigned int nloops = 0;
void loop(void) {
  nloops++;
  if (Serial) {
    Serial.println((String)"Loop " + nloops + "...");
  }
 
  bool result = false;
 
  // Read sunlight sensor data
  float visible = SI1145.ReadVisible();
  float IR = SI1145.ReadIR();
  float UV = SI1145.ReadUV();
  float uvIndex = UV / 100.0;  // UV index

  // Read environmental sensor data
  bme680.init();
  bme680.read_sensor_data();
  float temperature = bme680.read_temperature();  // Celsius
  float humidity = bme680.read_humidity();        // %
  float pressure = bme680.read_pressure();        // hPa
  float gas = bme680.read_gas() / 1000.0; // kOhms
  float moisture = analogRead(A0); 

  // Reset CayenneLPP buffer and add sensor data
  lpp.reset();
  lpp.addTemperature(1, temperature);
  lpp.addRelativeHumidity(2, humidity);
  lpp.addBarometricPressure(3, pressure);
  lpp.addAnalogInput(4, gas);  // Assuming gas resistance as analog input
  lpp.addLuminosity(5, visible);
  lpp.addLuminosity(6, IR);
  lpp.addAnalogInput(7, uvIndex);  // UV index as analog input
  lpp.addAnalogInput(8, moisture);
 
  // Transfer LoRa package
  result = lora.transferPacket(lpp.getBuffer(), lpp.getSize(), 5);                  // sends the Cayenne encoded data packet (n bytes) with a default timeout of 5 secs
  // result = lora.transferPacketWithConfirmed(lpp.getBuffer(), lpp.getSize(), 5);  // sends the Cayenne encoded data packet (n bytes) with a default timeout of 5 secs, using confirmed LoRa package
 
  if (result) {
    short length;
    short rssi;
 
    // Receive LoRaWAN package (LoraWAN Class A)
    char rx[256];
    length = lora.receivePacket(rx, 256, &rssi);
 
    // Check, if a package was received
    if (length)
    {
      if (Serial) {
        Serial.print("Length is: ");
        Serial.println(length);
        Serial.print("RSSI is: ");
        Serial.println(rssi);
        Serial.print("Data is: ");
 
        // Print received data as HEX
        for (unsigned char i = 0; i < length; i ++)
        {
          Serial.print("0x");
          Serial.print(rx[i], HEX);
          Serial.print(" ");
        }
 
        // Convert received package to int
        int rx_data_asInteger = atoi(rx);
 
        Serial.println();
        Serial.println("Received data: " + String(rx_data_asInteger));
      }
    }
  }
   
  if (Serial) {
    Serial.println((String)"Loop " + nloops + "...done!\n");
  }
  delay(60000);
 
}