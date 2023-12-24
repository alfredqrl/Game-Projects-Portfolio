// This plugin read the data streaming from VRduino and attach the read
// quaternion values to the corresponding object.
//
// This plugin is initially written by Vasanth Mohan, and modified by
// Varsha Sankar and Sagar Honnungar to be compatible with Windows.
using System;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.IO.Ports;
using UnityEngine;

public class ReadUSB : MonoBehaviour
{
    const int baudrate = 115200;

    // Specify Correct Port Name
    // Change this to be compatible with your computer.
    // The easiest way to check the port anme is to check it on Arduino IDE.
    // For example, "COM4" on Windows and "/dev/tty.usbmodem2815011" on Mac.
    const string portName = "COM7";


    SerialPort serialPort = new SerialPort(portName, baudrate);

    void Start() {

    serialPort.ReadTimeout = 100;
    serialPort.Open();
    if (!serialPort.IsOpen) {
        Debug.LogError("Couldn't open " + portName);
    }
    }

    void Update() {

        List<byte> buffer = new List<byte>();

        // Read 40 bytes (39 = 3(QC ) + 4 * 9(1 float+ ))
        for (int i = 0; i < 40; i++)
        {
            buffer.Add((byte)serialPort.ReadByte());
        }

        // Convert list of bytes to string
        string text = System.Text.Encoding.UTF8.GetString(buffer.ToArray());


        // Split string into lines
        string[] lines = text.Split('\n');
        string[] line = lines[0].Split(' ');

        if (line[0] == "QC")
        {
            float quat_x = HexToFloat(line[1]);
            float quat_y = HexToFloat(line[2]);
            float quat_z = HexToFloat(line[3]);
            float quat_w = HexToFloat(line[4]);

            Quaternion q = new Quaternion(quat_y, -quat_z, -quat_x, quat_w);

            q.Normalize();

            transform.rotation = Quaternion.Inverse(q);
            //transform.rotation = GameObject.FindWithTag("Mouse Camera").GetComponent<Transform>().rotation;
        }
    }

    void OnGUI() {
    string euler = "Euler angle: " + transform.eulerAngles.x + ", " +
                    transform.eulerAngles.y + ", " + transform.eulerAngles.z;
    }

    public static float HexToFloat(string hexVal)
    {
        byte[] data = new byte[hexVal.Length / 2];
        for (int i = 0; i < data.Length; ++i)
        {
            data[i] = Convert.ToByte(hexVal.Substring(i * 2, 2), 16);
        }
        return BitConverter.ToSingle(data, 0);
    }
}
