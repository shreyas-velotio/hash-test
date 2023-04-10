import {createXXHash64 , createAdler32 ,createXXHash3, createCRC32} from "hash-wasm";

const chunkSize = 64 * 1024 * 1024;
const fileReader = new FileReader();

export const fileHash = (fileElement,resultElement ) => {

    fileElement.addEventListener("change", async(event) => {
        resultElement.innerHTML = "";
        const file = event.target.files[0];
      
        let hashTypes = [ 'xxhash64', 'xxhash3', 'adler32', 'crc32' ];

        for(let hashType of hashTypes){
 
            const start = Date.now();
            const hash = await readFile(file, hashType);
            const end = Date.now();
            const duration = end - start;
            const fileSizeMB = file.size / 1024 / 1024;
            const throughput = fileSizeMB / (duration / 1000);
            
            resultElement.innerHTML = resultElement.innerHTML + `
                <h2>${hashType}</h2>
              Hash: ${hash}<br>
              Duration: ${duration} ms<br>
              Throughput: ${throughput.toFixed(2)} MB/s
            `;
        }

      });
}



function hashChunk(chunk, hasher) {
  return new Promise((resolve, reject) => {
    fileReader.onload = async(e) => {
      const view = new Uint8Array(e.target.result);
      hasher.update(view);
      resolve();
    };

    fileReader.readAsArrayBuffer(chunk);
  });
}

const readFile = async(file,hashType) => {

  let hasher;
  if(hashType === "xxhash64")
    hasher = await createXXHash64();
  if (hashType === "xxhash3")
    hasher = await createXXHash3();
  if (hashType === "adler32")
    hasher = await createAdler32();
  if (hashType === "crc32")
    hasher = await createCRC32();

  hasher.init();

  const chunkNumber = Math.floor(file.size / chunkSize);
  console.log("chunkNumber : ",chunkNumber)
  for (let i = 0; i <= chunkNumber; i++) {
    const chunk = file.slice(
      chunkSize * i,
      Math.min(chunkSize * (i + 1), file.size)
    );
    await hashChunk(chunk,hasher);
  }

  const hash = hasher.digest();
  return Promise.resolve(hash);
};
