#include "MPU9250.h"

MPU9250 mpu;

typedef union
{
  float v;
  uint8_t b[4];
}
cracked_float_t;

cracked_float_t quat_x, quat_y, quat_z, quat_w;


void setup() {
    Serial.begin(115200);
    Wire.begin();
    delay(2000);


    if (!mpu.setup(0x68)) {  // change to your own address
        while (1) {
            Serial.println("MPU connection failed. Please check your connection with `connection_check` example.");
            delay(5000);
        }
    }

    delay(5000);

    // calibrate anytime you want to
    Serial.println("Accel Gyro calibration will start in 5sec.");
    Serial.println("Please leave the device still on the flat plane.");
    mpu.verbose(true);
    delay(5000);
    mpu.calibrateAccelGyro();

    Serial.println("Mag calibration will start in 5sec.");
    Serial.println("Please Wave device in a figure eight until done.");
    delay(5000);
    mpu.calibrateMag();

    mpu.verbose(false);
}

void loop() {
  // if (mpu.update()) {
  //       update_quaternion();
  //       print_quaternion();
  // }
  if (mpu.update()) {
        static uint32_t prev_ms = millis();
        if (millis() > prev_ms + 25) {
            print_quaternion();
            prev_ms = millis();
        }
        update_quaternion();
  }
}

void update_quaternion()
{
  quat_x.v = mpu.getQuaternionX();
  quat_y.v = mpu.getQuaternionY();
  quat_z.v = mpu.getQuaternionZ();
  quat_w.v = mpu.getQuaternionW();
}

void print_quaternion()
{
  // update_quaternion();
  Serial.print("QC");
  Serial.print(' ');
  PrintHex8(quat_x.b, 4);
  Serial.print(' ');
  PrintHex8(quat_y.b, 4);
  Serial.print(' ');
  PrintHex8(quat_z.b, 4);
  Serial.print(' ');
  PrintHex8(quat_w.b, 4);
  Serial.println();
}

// prints 8-bit data in hex with leading zeroes
void PrintHex8(uint8_t *data, uint8_t length) 
{
      char tmp[16];
      for (int i=0; i<length; i++) { 
        sprintf(tmp, "%.2X",data[i]); 
        Serial.print(tmp);
      }
}
