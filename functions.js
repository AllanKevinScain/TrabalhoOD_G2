import { PASTA_XML, CONTAINER_XML, PASTA_JSON, CONTAINER_JSON, AZURE_STORAGE_CONNECTION_STRING } from "./config.js";
import { execSync, exec } from "child_process";
import * as fs from "fs";
import path from 'path';
import conversor from 'xml-js';
import * as storageBlob from '@azure/storage-blob';
import { info } from "console";

function criarJSON(nome, data) {
  fs.writeFileSync(path.resolve(PASTA_JSON, nome), data);
}

function xml2json(data) {
  return conversor.xml2json(data);
}

function base642json(data) {
  return JSON.parse(Buffer.from(data, "base64").toString("utf8"));
}

async function uploadXML() {
  let arrayArquivos = fs.readdirSync(PASTA_XML);
  let blobServiceClient = storageBlob.BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  let containerClient = blobServiceClient.getContainerClient("contoso-xml");
  arrayArquivos.forEach(async filename => {
    let caminho = path.resolve(PASTA_XML, filename);
    let infoFile = fs.statSync(caminho);

    let blobClient = containerClient.getBlockBlobClient(filename);
    let bufferSize = (1 * 1024 * 1024) / 2;
    let file = fs.createReadStream(caminho);

    try {
      console.log("Enviando arquivo" + filename);
      await blobClient.uploadStream(file, bufferSize, 5, {
        onProgress: (ev) => {
          let progress = ev.loadedBytes / infoFile.size;
          console.log(Math.round(progress*100) + "% conluido");
        }
      })
    } catch (e) {
      console.log(e);
    }
    // blobClient.uploadData(file, {
    //   onProgress: (ev) => {
    //     console.log(ev);
    //   }
    // })


  })


}

async function uploadJSON() {

  let arrayArquivos = fs.readdirSync(PASTA_JSON);
  let blobServiceClient = storageBlob.BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  let containerClient = blobServiceClient.getContainerClient("contoso-json");
  arrayArquivos.forEach(async filename => {
    let caminho = path.resolve(PASTA_JSON, filename);
    let infoFile = fs.statSync(caminho);

    let blobClient = containerClient.getBlockBlobClient(filename);
    let bufferSize = (1 * 1024 * 1024) / 2;
    let file = fs.createReadStream(caminho);

    try {
      console.log("Enviando arquivo " + filename);
      await blobClient.uploadStream(file, bufferSize, 5, {
        onProgress: (ev) => {
          let progress = ev.loadedBytes / infoFile.size;
          console.log(Math.round(progress*100) + " conluido",);
        }
      })
      fs.unlinkSync(caminho);
    } catch (e) {
      console.log(e);
    }
   
  });

}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export {
  sleep,
  uploadJSON,
  uploadXML,
  criarJSON,
  xml2json,
  base642json
}