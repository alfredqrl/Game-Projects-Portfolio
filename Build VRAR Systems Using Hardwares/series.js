var port;
var reader;
var inputDone;
var outputDone;
var inputStream;
var outputStream;

var showSerialData = async function(){
    // If port is already opened, disconnect
    if (port) {
        await disconnect();
        toggleUIConnected(false);
        return;
    }
    
    // Else, connect
    await connect();
    toggleUIConnected(true);
}

async function connect() {
  try {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const decoder = new TextDecoderStream();
      inputDone = port.readable.pipeTo(decoder.writable);
      inputStream = decoder.readable;

      reader = inputStream.getReader();
      readLoop();
  } catch (error) {
      console.error('Error connecting to the serial port: ', error);
  }
}

async function disconnect() {
    if (reader) {
        await reader.cancel();
        await inputDone.catch(() => {});
        reader = null;
        inputDone = null;
    }

    if (port) {
        await port.close();
        port = null;
    }
}

//async function readLoop() {
//  while (true) {
//     const { value, done } = await reader.read();
//      if (value) {
//          console.log('Received data: ', value);
 //         document.getElementById('target').textContent = value;
//      }
//      if (done) {
 //         reader.releaseLock();
 //         break;
 //     }
 // }
//}
let buffer = '';

async function readLoop() {
  while (true) {
      const { value, done } = await reader.read();
      if (value) {
          buffer += value;
          let newlineIndex = buffer.indexOf('\n');
          while (newlineIndex !== -1) {
              let line = buffer.slice(0, newlineIndex);
              buffer = buffer.slice(newlineIndex+1);
              handleLine(line);
              newlineIndex = buffer.indexOf('\n');
          }
      }
      if (done) {
          reader.releaseLock();
          break;
      }
  }
}

function handleLine(line) {
    let values = line.split(',').map(Number);
    if (values.length === 3) {
        let [yaw, pitch, roll] = values;
        // 在这里处理 yaw, pitch, roll 的值
        document.getElementById('target').textContent = `${yaw}, ${pitch}, ${roll}`;
    }
}

function toggleUIConnected(connected) {
    let lbl = connected ? 'Disconnect' : 'Connect';
    document.getElementById('connectButton').textContent = lbl;
}
