import {Buffer} from 'buffer';


 function formatAsFLVPacket(encodedData) {

  if (!Buffer.isBuffer(encodedData)) {
    console.error("encodedData is not a Buffer:", encodedData);
    return null; 
  }

  const flvHeader = Buffer.from([
    0x46, 0x4c, 0x56, 0x01, 0x05, 0x00, 0x00, 0x00, 0x09,
  ]);


  const packetSize = encodedData.length; 
  const timestamp = Math.floor(Date.now() % 1000000); 

  
  const timestampBytes = Buffer.alloc(4);
  timestampBytes.writeUInt32BE(timestamp);
  const dataSizeBytes = Buffer.alloc(3);
  dataSizeBytes.writeUIntBE(packetSize, 0, 3, 24);

  const flvPacket = Buffer.concat([
    flvHeader,
    dataSizeBytes,
    timestampBytes,
    encodedData,
  ]);

  return flvPacket;
}

export default formatAsFLVPacket

