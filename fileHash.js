import {createXXHash64 , createAdler32 ,createXXHash3, createCRC32 , createBLAKE3,createSHA1,createMD5} from "hash-wasm";

const chunkSize = 64 * 1024 * 1024;
const fileReader = new FileReader();

export const fileHash = (fileElement,resultElement,statusElem ) => {

    fileElement.addEventListener("change", async(event) => {

        resultElement.innerHTML = "";
        statusElem.innerHTML = "Loading... ";
        const files = event.target.files;
      
        let hashTypes = [ 'xxhash64', 'xxhash3', 'adler32', 'crc32', 'blake3' ,'md5'];

        for(let hashType of hashTypes){
            statusElem.innerHTML = 'Computing hash : ' + hashType + ' please wait...';
            const filesData = []
            for(let i=0; i< files.length; i++){
                const file = files[i];
                const {duration,fileSizeMB} = await calcHash(file , hashType);
                filesData.push({duration,fileSizeMB})
            }

            const totalFileSizeMB = filesData.reduce((acc,curr)=>acc+curr.fileSizeMB,0)
            const totalDuration = filesData.reduce((acc,curr)=>acc+curr.duration,0)

            const avgThroughput = totalFileSizeMB / (totalDuration / 1000);

            resultElement.innerHTML = resultElement.innerHTML + `
            <h3>${hashType}</h3>
            Duration: ${totalDuration} ms<br>
            Throughput: ${avgThroughput.toFixed(2)} MB/s
            <hr>`;
            statusElem.innerHTML = `Number of files ${files.length} | Total Size : ${totalFileSizeMB.toFixed(2)} MB`;

        }

      });
}

async function calcHash(file , hashType){
    const start = Date.now();
    await readFile(file, hashType);
    const end = Date.now();
    const duration = end - start;
    const fileSizeMB = file.size / 1024 / 1024;
    return {duration,fileSizeMB}
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
  if (hashType === "blake3")
    hasher = await createBLAKE3();
  if (hashType === "md5")
    hasher = await createMD5();

  hasher.init();

  const chunkNumber = Math.floor(file.size / chunkSize);

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
